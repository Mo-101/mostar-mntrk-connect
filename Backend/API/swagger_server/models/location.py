from datetime import datetime
from typing import Dict, List
from swagger_server.models.base_model_ import Model
import swagger_server.util as util


class Location(Model):
    """Location model"""

    def __init__(self, id: int = None, name: str = None, latitude: float = None,
                 longitude: float = None, elevation: float = None,
                 created_at: datetime = None, updated_at: datetime = None):
        self.swagger_types = {
            'id': int,
            'name': str,
            'latitude': float,
            'longitude': float,
            'elevation': float,
            'created_at': datetime,
            'updated_at': datetime
        }

        self.attribute_map = {
            'id': 'id',
            'name': 'name',
            'latitude': 'latitude',
            'longitude': 'longitude',
            'elevation': 'elevation',
            'created_at': 'created_at',
            'updated_at': 'updated_at'
        }

        self._id = id
        self._name = name
        self._latitude = latitude
        self._longitude = longitude
        self._elevation = elevation
        self._created_at = created_at
        self._updated_at = updated_at

    @classmethod
    def from_dict(cls, dikt) -> 'Location':
        """Returns the dict as a model"""
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this Location."""
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this Location."""
        self._id = id

    @property
    def name(self) -> str:
        """Gets the name of this Location."""
        return self._name

    @name.setter
    def name(self, name: str):
        """Sets the name of this Location."""
        self._name = name

    @property
    def latitude(self) -> float:
        """Gets the latitude of this Location."""
        return self._latitude

    @latitude.setter
    def latitude(self, latitude: float):
        """Sets the latitude of this Location."""
        self._latitude = latitude

    @property
    def longitude(self) -> float:
        """Gets the longitude of this Location."""
        return self._longitude

    @longitude.setter
    def longitude(self, longitude: float):
        """Sets the longitude of this Location."""
        self._longitude = longitude

    @property
    def elevation(self) -> float:
        """Gets the elevation of this Location."""
        return self._elevation

    @elevation.setter
    def elevation(self, elevation: float):
        """Sets the elevation of this Location."""
        self._elevation = elevation

    @property
    def created_at(self) -> datetime:
        """Gets the created_at of this Location."""
        return self._created_at

    @created_at.setter
    def created_at(self, created_at: datetime):
        """Sets the created_at of this Location."""
        self._created_at = created_at

    @property
    def updated_at(self) -> datetime:
        """Gets the updated_at of this Location."""
        return self._updated_at

    @updated_at.setter
    def updated_at(self, updated_at: datetime):
        """Sets the updated_at of this Location."""
        self._updated_at = updated_at
