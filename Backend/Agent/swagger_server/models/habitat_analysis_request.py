# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict, Any  # Updated to include Any

from swagger_server.models.base_model_ import Model
from swagger_server.models.habitat_analysis_request_environmental_data import HabitatAnalysisRequestEnvironmentalData  # noqa: F401,E501
from swagger_server import util


class HabitatAnalysisRequest(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, region: object=None, satellite_image_url: object=None, environmental_data: HabitatAnalysisRequestEnvironmentalData=None):  # noqa: E501
        """HabitatAnalysisRequest - a model defined in Swagger

        :param region: The region of this HabitatAnalysisRequest.  # noqa: E501
        :type region: object
        :param satellite_image_url: The satellite_image_url of this HabitatAnalysisRequest.  # noqa: E501
        :type satellite_image_url: object
        :param environmental_data: The environmental_data of this HabitatAnalysisRequest.  # noqa: E501
        :type environmental_data: HabitatAnalysisRequestEnvironmentalData
        """
        self.swagger_types = {
            'region': object,
            'satellite_image_url': object,
            'environmental_data': HabitatAnalysisRequestEnvironmentalData
        }

        self.attribute_map = {
            'region': 'region',
            'satellite_image_url': 'satellite_image_url',
            'environmental_data': 'environmental_data'
        }
        self._region = region
        self._satellite_image_url = satellite_image_url
        self._environmental_data = environmental_data

    @classmethod
    def from_dict(cls, dikt) -> 'HabitatAnalysisRequest':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The HabitatAnalysisRequest of this HabitatAnalysisRequest.  # noqa: E501
        :rtype: HabitatAnalysisRequest
        """
        return util.deserialize_model(dikt, cls)

    @property
    def region(self) -> object:
        """Gets the region of this HabitatAnalysisRequest.

        The region of interest (e.g., Nigeria).  # noqa: E501

        :return: The region of this HabitatAnalysisRequest.
        :rtype: object
        """
        return self._region

    @region.setter
    def region(self, region: object):
        """Sets the region of this HabitatAnalysisRequest.

        The region of interest (e.g., Nigeria).  # noqa: E501

        :param region: The region of this HabitatAnalysisRequest.
        :type region: object
        """
        self._region = region

    @property
    def satellite_image_url(self) -> object:
        """Gets the satellite_image_url of this HabitatAnalysisRequest.

        URL of the satellite imagery for analysis.  # noqa: E501

        :return: The satellite_image_url of this HabitatAnalysisRequest.
        :rtype: object
        """
        return self._satellite_image_url

    @satellite_image_url.setter
    def satellite_image_url(self, satellite_image_url: object):
        """Sets the satellite_image_url of this HabitatAnalysisRequest.

        URL of the satellite imagery for analysis.  # noqa: E501

        :param satellite_image_url: The satellite_image_url of this HabitatAnalysisRequest.
        :type satellite_image_url: object
        """
        self._satellite_image_url = satellite_image_url

    @property
    def environmental_data(self) -> HabitatAnalysisRequestEnvironmentalData:
        """Gets the environmental_data of this HabitatAnalysisRequest.

        :return: The environmental_data of this HabitatAnalysisRequest.
        :rtype: HabitatAnalysisRequestEnvironmentalData
        """
        return self._environmental_data

    @environmental_data.setter
    def environmental_data(self, environmental_data: HabitatAnalysisRequestEnvironmentalData):
        """Sets the environmental_data of this HabitatAnalysisRequest.

        :param environmental_data: The environmental_data of this HabitatAnalysisRequest.
        :type environmental_data: HabitatAnalysisRequestEnvironmentalData
        """
        self._environmental_data = environmental_data

    def to_dict(self) -> Dict[str, Any]:
        """Converts the model instance to a dictionary.

        :return: A dictionary representation of the model.
        :rtype: Dict[str, Any]
        """
        return {
            'region': self._region,
            'satellite_image_url': self._satellite_image_url,
            'environmental_data': self._environmental_data.to_dict() if self._environmental_data else None
        }
