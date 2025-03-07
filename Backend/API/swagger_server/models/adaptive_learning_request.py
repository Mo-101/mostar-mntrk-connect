# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class AdaptiveLearningRequest(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, model_type: object=None):  # noqa: E501
        """AdaptiveLearningRequest - a model defined in Swagger

        :param model_type: The model_type of this AdaptiveLearningRequest.  # noqa: E501
        :type model_type: object
        """
        self.swagger_types = {
            'model_type': object
        }

        self.attribute_map = {
            'model_type': 'model_type'
        }
        self._model_type = model_type

    @classmethod
    def from_dict(cls, dikt) -> 'AdaptiveLearningRequest':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The AdaptiveLearningRequest of this AdaptiveLearningRequest.  # noqa: E501
        :rtype: AdaptiveLearningRequest
        """
        return util.deserialize_model(dikt, cls)

    @property
    def model_type(self) -> object:
        """Gets the model_type of this AdaptiveLearningRequest.


        :return: The model_type of this AdaptiveLearningRequest.
        :rtype: object
        """
        return self._model_type

    @model_type.setter
    def model_type(self, model_type: object):
        """Sets the model_type of this AdaptiveLearningRequest.


        :param model_type: The model_type of this AdaptiveLearningRequest.
        :type model_type: object
        """

        self._model_type = model_type
