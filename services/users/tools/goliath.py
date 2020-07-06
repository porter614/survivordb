import csv
import os
import re
import gspread
from collections import defaultdict
import urllib
import boto3
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from tools.config import Config
from project.api.appearances.models import Appearance
from project.api.contestants.models import Contestant
from project.api.idols.models import Idol
from oauth2client.service_account import ServiceAccountCredentials

config = Config()
client = boto3.client("s3", region_name="us-west-2")

field_map = {
    "TotCh": "challengeAppearances",
    "ChW%": "challengeWinPercentage",
    "TICA": "immunityChallengeAppearances",
    "TICW": "immunityChallengeWins",
    "TRCA": "rewardChallengeAppearances",
    "TRCW": "rewardChallengeWins",
    "TChW": "challengeWins",
    "InICW": "individualImmunityChallengeWins",
    "InRCW": "individualRewardChallengeWins",
    "SO": "sitOuts",
    "VFB": "votesForBootee",
    "Non-VFB": "wrongSideOfTheVote",
    "VAP": "votesAgainst",
    "TotV": "totalVotesCast",
    "TCA": "tribalCouncilAppearances",
    "JVF": "juryVotesReceived",
    "Days": "daysPlayed",
    "Place": "place",
    "SurvAv": "rank",
}

idol_field_map = {
    "Finder": "finder",
    "Season": "season",
    "Idols held": "was_held",
    "Idols played": "was_played",
    "Votes voided": "votes_voided",
    "Boot avoided": "boot_avoided",
    "Tie avoided": "tie_avoided",
    "Day found": "day_found",
    "Day played": "day_played",
    "Notes": "note",
}


def read_survivor_data(path):
    with open(path, "r") as data:
        while "Days" not in data.readline():
            pos = data.tell()

        data.seek(pos)

        reader = csv.DictReader(data)
        reader.fieldnames[0] = "Name"
        for index, row in enumerate(reader):
            row["Name"] = re.sub(r"[^a-zA-Z ]+", "", row["Name"])
            if not row["Days"]:
                break
            else:
                # Weird edge case in survivor China
                if row["Days"] == "#REF!":
                    row["Days"] = -1
                if row["SurvAv"] == "#DIV/0!":
                    row["SurvAv"] = 0.0
                yield row


def generate_idols():
    data_folder = config.primary["DATA_PATH"] + "idols/idols.csv"
    with open(data_folder, "r") as data:
        reader = csv.DictReader(data)
        reader.fieldnames[0] = "Name"

        idol_appearances = defaultdict(list)
        idols = []
        for _, row in enumerate(reader):
            row["Finder"] = re.sub(r"[^a-zA-Z ]+", "", row["Name"].split("-")[0])
            row["Season"] = int(row["Season"].split("S")[1])
            row["Idols held"] = False if row["Idols held"] == "0" else True
            row["Idols played"] = False if row["Idols played"] == "0" else True
            row["Boot avoided"] = True if row["Boot avoided"] == "1" else False
            row["Tie avoided"] = False if not row["Tie avoided"] else True

            idol_dict = {
                idol_field_map[k]: v
                for k, v in dict(row).items()
                if k in idol_field_map
            }

            for _, field in idol_field_map.items():
                if field not in idol_dict or not idol_dict[field]:
                    # set a default
                    idol_dict[field] = 0

            idol = Idol(**idol_dict)
            idols.append(idol)

        return idols


def generate_season_appearances(season, generator):
    player_appearances = []
    for i, row in enumerate(generator):
        player_dict = {field_map[k]: v for k, v in dict(row).items() if k in field_map}
        player_dict["season"] = season

        for _, field in field_map.items():
            if field not in player_dict:
                # set a default
                player_dict[field] = 0

        contestant = row.get("Name")
        contestant = contestant.replace("*", "")
        if contestant is not None:
            player_appearance = Appearance(**player_dict)
            player_appearances.append((contestant, player_appearance))

    return player_appearances


def generate_appearances():
    data_folder = config.primary["DATA_PATH"]
    all_appearances = []

    for file_name in os.listdir(data_folder):
        file_path = os.path.join(data_folder, file_name)
        if os.path.isfile(file_path):
            generator = read_survivor_data(file_path)

            season = re.search(r"S([0-9]+):", file_name).group(1)
            player_appearances = generate_season_appearances(season, generator)

            all_appearances.extend(player_appearances)

    return all_appearances


def download_season_data():
    gc = gspread.service_account()

    resp = requests.get(config.primary["DATA_URL"]).text

    soup = BeautifulSoup(resp, "html.parser")
    season_data = list(
        map(
            lambda season: (season.li.img.get("title"), season.li.a.get("href")),
            soup.findAll("ul", {"class": "cast"}),
        )
    )

    for title, url in season_data:
        if title + ".csv" in os.listdir(config.primary["DATA_PATH"]):
            continue
        if "docs.google.com" not in url:
            continue
        try:
            s = gc.open_by_url(url)
            worksheet = s.worksheets()[0]
            worksheet_values = worksheet.get_all_values()

            with open(
                config.primary["DATA_PATH"] + title + ".csv", "w", newline=""
            ) as f:
                writer = csv.writer(f)
                writer.writerows(worksheet_values)

        except Exception as e:
            print(e)
            break


def fetch_contestant_photos_deprecated():
    urls = [
        "https://www.truedorktimes.com/survivor/cast/season1-10.htm",
        "https://www.truedorktimes.com/survivor/cast/season11-20.htm",
        "https://www.truedorktimes.com/survivor/cast/season21-30.htm",
        "https://www.truedorktimes.com/survivor/cast/season31-40.htm",
    ]

    base_url = "https://www.truedorktimes.com/survivor/cast/"
    img_list = []
    for url in urls:
        resp = requests.get(url).text

        soup = BeautifulSoup(resp, "html.parser")
        img_list.extend(
            list(
                map(
                    lambda img: base_url + img.get("src"),
                    soup.findAll("img", {"class": "castimg"}),
                )
            )
        )

    for image in img_list:
        urllib.request.urlretrieve(
            image,
            config.primary["DATA_PATH"] + "contestant_photos/" + image.split("/")[-1],
        )


def fetch_contestant_photos_wikia():
    base_url = "https://survivor.fandom.com/wiki/"
    appearances = generate_appearances()
    img_links = []
    for (name, appearance) in appearances[10:]:
        try:
            print("Fetching: " + name)

            # clean non alphanumeric characters
            contestant_name = name.replace(" ", "_")

            wikia_url = base_url + contestant_name
            resp = requests.get(wikia_url).text
            img_file_name = "S" + str(appearance.season) + " " + name + ".jpg"

            soup = BeautifulSoup(resp, "html.parser")
            img_link = list(
                map(
                    lambda img: img.get("srcset").split(",")[1].split(" ")[1],
                    soup.findAll("img", {"data-image-name": img_file_name},),
                )
            )[0]

            dst_file_path = (
                config.primary["DATA_PATH"]
                + "contestant_photos_high_res/"
                + img_file_name
            )
            urllib.request.urlretrieve(img_link, dst_file_path)

            client.upload_file(
                dst_file_path,
                "survivordb",
                img_file_name,
                ExtraArgs={"ACL": "public-read", "ContentType": "image/jpeg"},
            )
            # generic named photo; season agnostic
            client.upload_file(
                dst_file_path,
                "survivordb",
                name + ".jpg",
                ExtraArgs={"ACL": "public-read", "ContentType": "image/jpeg"},
            )
        except Exception as e:
            print(e)
            continue


def generate_contestant_image_link(name):
    base_url = "https://www.truedorktimes.com/survivor/cast/images/"
    return base_url + "-".join(name.lower().split(" ")) + ".jpg"


def generate_profile_image_link(name):
    base_url = "https://survivordb.s3-us-west-2.amazonaws.com/"
    return base_url + name + ".jpg"


def fetch_season_logos():
    base_url = "https://logos.fandom.com/wiki/Survivor_(TV_series)"

    resp = requests.get(base_url).text

    soup = BeautifulSoup(resp, "html.parser")
    logo_links = list(
        map(
            lambda a: a.get("href"),
            soup.findAll("a", {"class": "image image-thumbnail"}),
        )
    )

    for season_number, logo_link in enumerate(logo_links):
        urllib.request.urlretrieve(
            logo_link,
            config.primary["DATA_PATH"]
            + "season_logos/"
            + str(season_number + 1)
            + ".jpg",
        )


def upload_season_logos_s3():
    data_folder = config.primary["DATA_PATH"] + "season_logos/"
    for file_name in os.listdir(data_folder):
        print(file_name)
        client.upload_file(
            data_folder + file_name,
            "survivordb",
            file_name,
            ExtraArgs={"ACL": "public-read", "ContentType": "image/jpeg"},
        )


def get_contestant_personal_data(name):
    base_url = "https://survivor.fandom.com/wiki/"
    wikia_url = base_url + name
    resp = requests.get(wikia_url).text

    soup = BeautifulSoup(resp, "html.parser")
    f = open(
        config.primary["DATA_PATH"] + "personal_data/ContestantPersonalData.csv", "a"
    )
    try:
        birthday = list(
            map(lambda span: span.text, soup.findAll(attrs={"class": "bday"}))
        )[0]
        birthday = datetime.strptime(birthday, "%Y-%m-%d")

        occupations = list(
            map(
                lambda span: span.div.text.split(";"),
                soup.findAll(attrs={"data-source": "occupation"}),
            )
        )[0]

        hometown = list(
            map(
                lambda span: span.div.text.split(";")[-1],
                soup.findAll(attrs={"data-source": "hometown"}),
            )
        )[0]
        f.write(
            ",".join([name, str(birthday), ";".join(occupations), '"' + hometown + '"'])
            + "\n"
        )
        return (birthday, occupations, hometown)
    except Exception as e:
        print(e)
        f.close()
        return
    f.close()


if __name__ == "__main__":
    fetch_season_logos()
