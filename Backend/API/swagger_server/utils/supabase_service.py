import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SupabaseService:
    """Mock Supabase service for testing"""

    def __init__(self):
        self.data = {
            'observations': [],
            'locations': [],
            'environmental_data': [],
            'risk_assessments': []
        }

    def add_observation(self, observation_data):
        """Add a new observation"""
        try:
            observation = {
                'id': len(self.data['observations']) + 1,
                **observation_data,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            self.data['observations'].append(observation)
            return {'success': True, 'data': observation}
        except Exception as e:
            logger.error(f"Error adding observation: {str(e)}")
            return {'success': False, 'error': str(e)}

    def get_observations(self, location_id=None):
        """Get observations, optionally filtered by location"""
        try:
            observations = self.data['observations']
            if location_id:
                observations = [o for o in observations if o['location_id'] == location_id]
            return {'success': True, 'data': observations}
        except Exception as e:
            logger.error(f"Error getting observations: {str(e)}")
            return {'success': False, 'error': str(e)}

    def add_environmental_data(self, env_data):
        """Add environmental data"""
        try:
            data = {
                'id': len(self.data['environmental_data']) + 1,
                **env_data,
                'created_at': datetime.now().isoformat()
            }
            self.data['environmental_data'].append(data)
            return {'success': True, 'data': data}
        except Exception as e:
            logger.error(f"Error adding environmental data: {str(e)}")
            return {'success': False, 'error': str(e)}

    def update_risk_assessment(self, location_id, risk_data):
        """Update risk assessment"""
        try:
            assessment = {
                'id': len(self.data['risk_assessments']) + 1,
                'location_id': location_id,
                **risk_data,
                'updated_at': datetime.now().isoformat()
            }
            self.data['risk_assessments'].append(assessment)
            return {'success': True, 'data': assessment}
        except Exception as e:
            logger.error(f"Error updating risk assessment: {str(e)}")
            return {'success': False, 'error': str(e)}

    def get_location_summary(self, location_id):
        """Get location summary"""
        try:
            observations = [o for o in self.data['observations'] 
                          if o['location_id'] == location_id]
            env_data = [e for e in self.data['environmental_data'] 
                       if e['location_id'] == location_id]
            risk_assessments = [r for r in self.data['risk_assessments'] 
                              if r['location_id'] == location_id]

            return {
                'success': True,
                'data': {
                    'latest_observation': observations[-1] if observations else None,
                    'latest_environmental_data': env_data[-1] if env_data else None,
                    'latest_risk_assessment': risk_assessments[-1] if risk_assessments else None
                }
            }
        except Exception as e:
            logger.error(f"Error getting location summary: {str(e)}")
            return {'success': False, 'error': str(e)}
