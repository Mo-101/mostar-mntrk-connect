from datetime import datetime
from typing import Dict, List
from swagger_server.models.base_model_ import Model
import swagger_server.util as util


class RiskAssessment(Model):
    """RiskAssessment model"""

    def __init__(self, id: int = None, location_id: int = None,
                 assessment_date: datetime = None, risk_level: str = None,
                 factors: Dict = None, mitigation_measures: List[str] = None,
                 created_at: datetime = None, updated_at: datetime = None):
        self.swagger_types = {
            'id': int,
            'location_id': int,
            'assessment_date': datetime,
            'risk_level': str,
            'factors': Dict,
            'mitigation_measures': List[str],
            'created_at': datetime,
            'updated_at': datetime
        }

        self.attribute_map = {
            'id': 'id',
            'location_id': 'location_id',
            'assessment_date': 'assessment_date',
            'risk_level': 'risk_level',
            'factors': 'factors',
            'mitigation_measures': 'mitigation_measures',
            'created_at': 'created_at',
            'updated_at': 'updated_at'
        }

        self._id = id
        self._location_id = location_id
        self._assessment_date = assessment_date
        self._risk_level = risk_level
        self._factors = factors
        self._mitigation_measures = mitigation_measures
        self._created_at = created_at
        self._updated_at = updated_at

    @classmethod
    def from_dict(cls, dikt) -> 'RiskAssessment':
        """Returns the dict as a model"""
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this RiskAssessment."""
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this RiskAssessment."""
        self._id = id

    @property
    def location_id(self) -> int:
        """Gets the location_id of this RiskAssessment."""
        return self._location_id

    @location_id.setter
    def location_id(self, location_id: int):
        """Sets the location_id of this RiskAssessment."""
        self._location_id = location_id

    @property
    def assessment_date(self) -> datetime:
        """Gets the assessment_date of this RiskAssessment."""
        return self._assessment_date

    @assessment_date.setter
    def assessment_date(self, assessment_date: datetime):
        """Sets the assessment_date of this RiskAssessment."""
        self._assessment_date = assessment_date

    @property
    def risk_level(self) -> str:
        """Gets the risk_level of this RiskAssessment."""
        return self._risk_level

    @risk_level.setter
    def risk_level(self, risk_level: str):
        """Sets the risk_level of this RiskAssessment."""
        allowed_values = ["low", "medium", "high", "critical"]
        if risk_level not in allowed_values:
            raise ValueError(
                f"Invalid value for `risk_level` ({risk_level}), must be one of {allowed_values}"
            )
        self._risk_level = risk_level

    @property
    def factors(self) -> Dict:
        """Gets the factors of this RiskAssessment."""
        return self._factors

    @factors.setter
    def factors(self, factors: Dict):
        """Sets the factors of this RiskAssessment."""
        self._factors = factors

    @property
    def mitigation_measures(self) -> List[str]:
        """Gets the mitigation_measures of this RiskAssessment."""
        return self._mitigation_measures

    @mitigation_measures.setter
    def mitigation_measures(self, mitigation_measures: List[str]):
        """Sets the mitigation_measures of this RiskAssessment."""
        self._mitigation_measures = mitigation_measures

    @property
    def created_at(self) -> datetime:
        """Gets the created_at of this RiskAssessment."""
        return self._created_at

    @created_at.setter
    def created_at(self, created_at: datetime):
        """Sets the created_at of this RiskAssessment."""
        self._created_at = created_at

    @property
    def updated_at(self) -> datetime:
        """Gets the updated_at of this RiskAssessment."""
        return self._updated_at

    @updated_at.setter
    def updated_at(self, updated_at: datetime):
        """Sets the updated_at of this RiskAssessment."""
        self._updated_at = updated_at
