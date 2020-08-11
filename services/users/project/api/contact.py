# project/api/contact.py
from flask import request, current_app

from flask_restx import Namespace, Resource
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


contact_namespace = Namespace("contact")


class Contact(Resource):
    def post(self):
        post_data = request.get_json()
        name = post_data.get("name")
        email = post_data.get("email")
        message = post_data.get("message")  # new

        sender = "survivorcbsdb@gmail.com"
        receiver = "moltern994@gmail.com"

        message = f"""From: {name}\nEmail: {email}\nMessage:{message}"""

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "You have a feature recommendation/comment from SurvivorDB.com"
        msg["From"] = sender
        msg["To"] = receiver

        # Record the MIME types of both parts - text/plain and text/html.
        part1 = MIMEText(message, "plain")

        # Attach parts into message container.
        # According to RFC 2046, the last part of a multipart message, in this case
        # the HTML message, is best and preferred.
        msg.attach(part1)
        server = smtplib.SMTP("smtp.gmail.com:587")
        server.starttls()
        server.login(sender, current_app.config.get("NO_REPLY_PASSWORD"))
        server.sendmail(sender, [receiver], msg.as_string())
        server.quit()

        return {}, 201


contact_namespace.add_resource(Contact, "")
