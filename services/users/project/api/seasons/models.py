# services/users/project/api/contestants/models.py

import os


from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

from project import db
from flask import current_app


class Link(db.Model):
    __tablename__ = "link"
    department_id = db.Column(db.Integer, db.ForeignKey("seasons.id"), primary_key=True)
    employee_id = db.Column(
        db.Integer, db.ForeignKey("contestants.id"), primary_key=True
    )


class Season(db.Model):

    __tablename__ = "seasons"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order = db.Column(db.Integer, nullable=False)
    appearances = db.relationship("Appearance")
    contestants = db.relationship(
        "Contestant",
        secondary="link",
        # backref="contestants",  # back_populates="contestants"
    )

    title = db.Column(db.String(256), default="unknown", nullable=False)
    image_link = db.Column(db.String(256), default="unknown", nullable=False)
    location = db.Column(db.String(256), default="unknown", nullable=False)
    startDate = db.Column(db.DateTime, default=func.now(), nullable=False)

