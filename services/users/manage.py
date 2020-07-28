import sys

from flask.cli import FlaskGroup

from project import create_app, db
from project.api.users.models import User
from project.api.contestants.models import Contestant
from project.api.appearances.models import Appearance
from project.api.idols.models import Idol
from project.api.seasons.models import Season
from tools.goliath import (
    generate_appearances,
    fetch_contestant_photos_wikia,
    generate_contestant_image_link,
    fetch_season_logos,
    upload_season_logos_s3,
    generate_profile_image_link,
    get_contestant_personal_data,
    get_contestant_personal_data_from_csv,
    generate_idols,
    eval_race_gender,
)
from tools.goliath import download_season_data
from collections import defaultdict


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command("recreate_db")
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("seed_db")
def seed_db():
    db.session.add(
        User(username="michael", email="hermanmu@gmail.com", password="password")
    )
    db.session.add(
        User(username="michaelherman", email="michael@mherman.org", password="password")
    )
    db.session.commit()


@cli.command("seed_survivor")
def seed_survivor():
    appearances = generate_appearances()
    idols = generate_idols()
    seasons = defaultdict(list)

    for contestant_name, appearance in appearances:
        print(contestant_name)

        contestant = Contestant.query.filter_by(name=contestant_name).first()
        if not contestant:
            personal_data = get_contestant_personal_data_from_csv(contestant_name)

            contestant = Contestant(
                name=contestant_name,
                image_link=generate_contestant_image_link(contestant_name),
                profile_image_link=generate_profile_image_link(contestant_name),
            )
            if personal_data:
                for occupation in personal_data[1]:
                    contestant.occupation = occupation
                contestant.birthdate = personal_data[0]
                contestant.hometown = personal_data[2]

            db.session.add(contestant)

        # could optimize
        for idol in idols:
            if idol.finder == contestant_name and str(idol.season) == str(
                appearance.season
            ):
                appearance.idols.append(idol)
                db.session.add(idol)

        if not seasons[appearance.season]:
            seasons[appearance.season] = Season(order=appearance.season)

        seasons[appearance.season].contestants.append(contestant)
        seasons[appearance.season].appearances.append(appearance)

        contestant.appearances.append(appearance)
        db.session.add(appearance)

    for season in seasons.values():
        db.session.add(season)

    db.session.commit()


@cli.command("seed_jeff")
def seed_jeff():
    appearance = generate_appearances()[0][1]
    appearance.season = -1
    contestant = Contestant(
        name="Jeff Probst",
        image_link="https://www.southjersey.com/articleimages/ACF75E.gif",
        profile_image_link="https://www.southjersey.com/articleimages/ACF75E.gif",
    )
    db.session.add(appearance)
    contestant.appearances.append(appearance)
    db.session.add(contestant)
    db.session.commit()


# @cli.command("download_survivor")
# def cli_download_season_data():
#     download_season_data()


@cli.command("fetch_photos")
def fetch_photos():
    appearances = generate_appearances()


@cli.command("eval_race_gender")
def get_contestants():
    eval_race_gender()


if __name__ == "__main__":
    cli()
