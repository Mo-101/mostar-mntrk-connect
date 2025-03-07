from datetime import datetime
from typing import Dict, List
from swagger_server.models.base_model_ import Model
import swagger_server.util as util


class Observation(Model):
    """Observation model"""

    def __init__(self, id: int = None, location_id: int = None,
                 observer_id: str = None, observation_date: datetime = None,
                 population_count: int = None, habitat_description: str = None,
                 weather_conditions: Dict = None, images: List[str] = None,
                 status: str = None, notes: str = None,
                 created_at: datetime = None, updated_at: datetime = None):
        self.swagger_types = {
            'id': int,
            'location_id': int,
            'observer_id': str,
            'observation_date': datetime,
            'population_count': int,
            'habitat_description': str,
            'weather_conditions': Dict,
            'images': List[str],
            'status': str,
            'notes': str,
            'created_at': datetime,
            'updated_at': datetime
        }

        self.attribute_map = {
            'id': 'id',
            'location_id': 'location_id',
            'observer_id': 'observer_id',
            'observation_date': 'observation_date',
            'population_count': 'population_count',
            'habitat_description': 'habitat_description',
            'weather_conditions': 'weather_conditions',
            'images': 'images',
            'status': 'status',
            'notes': 'notes',
            'created_at': 'created_at',
            'updated_at': 'updated_at'
        }

        self._id = id
        self._location_id = location_id
        self._observer_id = observer_id
        self._observation_date = observation_date
        self._population_count = population_count
        self._habitat_description = habitat_description
        self._weather_conditions = weather_conditions
        self._images = images
        self._status = status
        self._notes = notes
        self._created_at = created_at
        self._updated_at = updated_at

    @classmethod
    def from_dict(cls, dikt) -> 'Observation':
        """Returns the dict as a model"""
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this Observation."""
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this Observation."""
        self._id = id

    @property
    def location_id(self) -> int:
        """Gets the location_id of this Observation."""
        return self._location_id

    @location_id.setter
    def location_id(self, location_id: int):
        """Sets the location_id of this Observation."""
        self._location_id = location_id

    @property
    def observer_id(self) -> str:
        """Gets the observer_id of this Observation."""
        return self._observer_id

    @observer_id.setter
    def observer_id(self, observer_id: str):
        """Sets the observer_id of this Observation."""
        self._observer_id = observer_id

    @property
    def observation_date(self) -> datetime:
        """Gets the observation_date of this Observation."""
        return self._observation_date

    @observation_date.setter
    def observation_date(self, observation_date: datetime):
        """Sets the observation_date of this Observation."""
        self._observation_date = observation_date

    @property
    def population_count(self) -> int:
        """Gets the population_count of this Observation."""
        return self._population_count

    @population_count.setter
    def population_count(self, population_count: int):
        """Sets the population_count of this Observation."""
        self._population_count = population_count

    @property
    def habitat_description(self) -> str:
        """Gets the habitat_description of this Observation."""
        return self._habitat_description

    @habitat_description.setter
    def habitat_description(self, habitat_description: str):
        """Sets the habitat_description of this Observation."""
        self._habitat_description = habitat_description

    @property
    def weather_conditions(self) -> Dict:
        """Gets the weather_conditions of this Observation."""
        return self._weather_conditions

    @weather_conditions.setter
    def weather_conditions(self, weather_conditions: Dict):
        """Sets the weather_conditions of this Observation."""
        self._weather_conditions = weather_conditions

    @property
    def images(self) -> List[str]:
        """Gets the images of this Observation."""
        return self._images

    @images.setter
    def images(self, images: List[str]):
        """Sets the images of this Observation."""
        self._images = images

    @property
    def status(self) -> str:
        """Gets the status of this Observation."""
        return self._status

    @status.setter
    def status(self, status: str):
        """Sets the status of this Observation."""
        allowed_values = ["pending", "verified", "rejected"]
        if status not in allowed_values:
            raise ValueError(
                f"Invalid value for `status` ({status}), must be one of {allowed_values}"
            )
        self._status = status

    @property
    def notes(self) -> str:
        """Gets the notes of this Observation."""
        return self._notes

    @notes.setter
    def notes(self, notes: str):
        """Sets the notes of this Observation."""
        self._notes = notes

    @property
    def created_at(self) -> datetime:
        """Gets the created_at of this Observation."""
        return self._created_at

    @created_at.setter
    def created_at(self, created_at: datetime):
        """Sets the created_at of this Observation."""
        self._created_at = created_at

    @property
    def updated_at(self) -> datetime:
        """Gets the updated_at of this Observation."""
        return self._updated_at

    @updated_at.setter
    def updated_at(self, updated_at: datetime):
        """Sets the updated_at of this Observation."""
        self._updated_at = updated_at
