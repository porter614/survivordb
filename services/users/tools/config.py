import marshmallow


class Config(marshmallow.Schema):
    def __init__(self):
        super().__init__()
        # config_dict = self.dump_fields.keys()
        self.primary = self.load({})

    DATA_PATH = marshmallow.fields.Str(
        missing="./data/", validate=marshmallow.validate.Length(min=1)
    )
    DATA_URL = marshmallow.fields.Str(
        missing="https://www.truedorktimes.com/survivor/boxscores/data.htm",
        validate=marshmallow.validate.Length(min=1),
    )
