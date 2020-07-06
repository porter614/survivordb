import requests
import json

base_url = "http://betafaceapi.com/api/v2/"
client = boto3.client("s3", region_name="us-west-2")


def analyze_face(face_uri):
    url = base_url + "media"
    file_name = '"' + face_uri.split("/")[-1].replace('"', "") + '"'

    headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
    }

    data = (
        '{ "api_key": "d45fd466-51e2-4701-8da8-04351c872236", "file_uri": '
        + face_uri
        + ', "detection_flags": "basicpoints,propoints,classifiers,content", "recognize_targets": [ "all@mynamespace" ], "original_filename": '
        + file_name
        + "}"
    )
    response = requests.post(url, headers=headers, data=data)
    print(response.json())


def modify_content_type():
    typed = "image/jpeg"

    # client.put_object(Key="index.html", Body=data, ContentType="text/html")
    # client.get


if __name__ == "__main__":
    analyze_face('"https://survivordb.s3-us-west-2.amazonaws.com/Alicia+Rosa.jpg"')
