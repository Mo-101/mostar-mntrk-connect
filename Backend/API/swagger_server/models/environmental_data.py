from datetime import datetime
from swagger_server.models.base_model_ import Model
import swagger_server.util as util


class EnvironmentalData(Model):
    """EnvironmentalData model"""

    def __init__(self, id: int = None, location_id: int = None,
                 timestamp: datetime = None, temperature: float = None,
                 humidity: float = None, rainfall: float = None,
                 soil_moisture: float = None, vegetation_index: float = None,
                 created_at: datetime = None):
        self.swagger_types = {
            'id': int,
            'location_id': int,
            'timestamp': datetime,
            'temperature': float,
            'humidity': float,
            'rainfall': float,
            'soil_moisture': float,
            'vegetation_index': float,
            'created_at': datetime
        }

        self.attribute_map = {
            'id': 'id',
            'location_id': 'location_id',
            'timestamp': 'timestamp',
            'temperature': 'temperature',
            'humidity': 'humidity',
            'rainfall': 'rainfall',
            'soil_moisture': 'soil_moisture',
            'vegetation_index': 'vegetation_index',
            'created_at': 'created_at'
        }

        self._id = id
        self._location_id = location_id
        self._timestamp = timestamp
        self._temperature = temperature
        self._humidity = humidity
        self._rainfall = rainfall
        self._soil_moisture = soil_moisture
        self._vegetation_index = vegetation_index
        self._created_at = created_at

    @classmethod
    def from_dict(cls, dikt) -> 'EnvironmentalData':
        """Returns the dict as a model"""
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this EnvironmentalData."""
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this EnvironmentalData."""
        self._id = id

    @property
    def location_id(self) -> int:
        """Gets the location_id of this EnvironmentalData."""
        return self._location_id

    @location_id.setter
    def location_id(self, location_id: int):
        """Sets the location_id of this EnvironmentalData."""
        self._location_id = location_id

    @property
    def timestamp(self) -> datetime:
        """Gets the timestamp of this EnvironmentalData."""
        return self._timestamp

    @timestamp.setter
    def timestamp(self, timestamp: datetime):
        """Sets the timestamp of this EnvironmentalData."""
        self._timestamp = timestamp

    @property
    def temperature(self) -> float:
        """Gets the temperature of this EnvironmentalData."""
        return self._temperature

    @temperature.setter
    def temperature(self, temperature: float):
        """Sets the temperature of this EnvironmentalData."""
        self._temperature = temperature

    @property
    def humidity(self) -> float:
        """Gets the humidity of this EnvironmentalData."""
        return self._humidity

    @humidity.setter
    def humidity(self, humidity: float):
        """Sets the humidity of this EnvironmentalData."""
        if humidity is not None and (humidity < 0 or humidity > 100):
            raise ValueError("Humidity must be between 0 and 100")
        self._humidity = humidity

    @property
    def rainfall(self) -> float:
        """Gets the rainfall of this EnvironmentalData."""
        return self._rainfall

    @rainfall.setter
    def rainfall(self, rainfall: float):
        """Sets the rainfall of this EnvironmentalData."""
        if rainfall is not None and rainfall < 0:
            raise ValueError("Rainfall cannot be negative")
        self._rainfall = rainfall

    @property
    def soil_moisture(self) -> float:
        """Gets the soil_moisture of this EnvironmentalData."""
        return self._soil_moisture

    @soil_moisture.setter
    def soil_moisture(self, soil_moisture: float):
        """Sets the soil_moisture of this EnvironmentalData."""
        if soil_moisture is not None and (soil_moisture < 0 or soil_moisture > 1):
            raise ValueError("Soil moisture must be between 0 and 1")
        self._soil_moisture = soil_moisture

    @property
    def vegetation_index(self) -> float:
        """Gets the vegetation_index of this EnvironmentalData."""
        return self._vegetation_index

    @vegetation_index.setter
    def vegetation_index(self, vegetation_index: float):
        """Sets the vegetation_index of this EnvironmentalData."""
        if vegetation_index is not None and (vegetation_index < 0 or vegetation_index > 1):
            raise ValueError("Vegetation index must be between 0 and 1")
        self._vegetation_index = vegetation_index

    @property
    def created_at(self) -> datetime:
        """Gets the created_at of this EnvironmentalData."""
        return self._created_at

    @created_at.setter
    def created_at(self, created_at: datetime):
        """Sets the created_at of this EnvironmentalData."""
        self._created_at = created_at
