from swagger_server.models.base_model_ import Model
from swagger_server.models.observation import Observation
from swagger_server.models.environmental_data import EnvironmentalData
from swagger_server.models.risk_assessment import RiskAssessment
import swagger_server.util as util


class LocationSummary(Model):
    """LocationSummary model"""

    def __init__(self, latest_observation: Observation = None,
                 latest_environmental_data: EnvironmentalData = None,
                 latest_risk_assessment: RiskAssessment = None):
        self.swagger_types = {
            'latest_observation': Observation,
            'latest_environmental_data': EnvironmentalData,
            'latest_risk_assessment': RiskAssessment
        }

        self.attribute_map = {
            'latest_observation': 'latest_observation',
            'latest_environmental_data': 'latest_environmental_data',
            'latest_risk_assessment': 'latest_risk_assessment'
        }

        self._latest_observation = latest_observation
        self._latest_environmental_data = latest_environmental_data
        self._latest_risk_assessment = latest_risk_assessment

    @classmethod
    def from_dict(cls, dikt) -> 'LocationSummary':
        """Returns the dict as a model"""
        return util.deserialize_model(dikt, cls)

    @property
    def latest_observation(self) -> Observation:
        """Gets the latest_observation of this LocationSummary."""
        return self._latest_observation

    @latest_observation.setter
    def latest_observation(self, latest_observation: Observation):
        """Sets the latest_observation of this LocationSummary."""
        self._latest_observation = latest_observation

    @property
    def latest_environmental_data(self) -> EnvironmentalData:
        """Gets the latest_environmental_data of this LocationSummary."""
        return self._latest_environmental_data

    @latest_environmental_data.setter
    def latest_environmental_data(self, latest_environmental_data: EnvironmentalData):
        """Sets the latest_environmental_data of this LocationSummary."""
        self._latest_environmental_data = latest_environmental_data

    @property
    def latest_risk_assessment(self) -> RiskAssessment:
        """Gets the latest_risk_assessment of this LocationSummary."""
        return self._latest_risk_assessment

    @latest_risk_assessment.setter
    def latest_risk_assessment(self, latest_risk_assessment: RiskAssessment):
        """Sets the latest_risk_assessment of this LocationSummary."""
        self._latest_risk_assessment = latest_risk_assessment
