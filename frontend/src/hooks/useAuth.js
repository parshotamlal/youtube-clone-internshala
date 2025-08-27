import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, setUser } from '../redux/authSlice';
import { authAPI } from '../utils/api';
import { storage } from '../utils/helpers';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  // Check for existing token on app load
  useEffect(() => {
    const storedToken = storage.get('token');
    const storedUser = storage.get('user');
    
    if (storedToken && storedUser) {
      dispatch(setUser({ user: storedUser, token: storedToken }));
    }
  }, [dispatch]);

  const loginUser = async (credentials) => {
    try {
      const response = await dispatch(login(credentials)).unwrap();
      storage.set('token', response.token);
      storage.set('user', response.user);
      navigate('/');
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    storage.remove('token');
    storage.remove('user');
    navigate('/');
  };

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    loginUser,
    logoutUser,
  };
};