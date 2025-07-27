import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../config/auth';
import { getApiBaseUrl } from '../utils/env';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiService {
  private instance: AxiosInstance;
  private baseURL = getApiBaseUrl();

  constructor() {
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar o token
    this.instance.interceptors.request.use(
      async (config) => {
        try {
          const storedTokens = await AsyncStorage.getItem(storageKeys.tokens);
          if (storedTokens) {
            const tokenData = JSON.parse(storedTokens);
            config.headers.Authorization = `Bearer ${tokenData.access_token}`;
          }
        } catch (error) {
          console.log('❌ Erro ao obter token para requisição:', error);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratar erros globais
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: 'Erro na requisição',
          status: error.response?.status,
          code: error.code,
        };

        console.log(error.response)

        if (error.response?.status === 401) {
          apiError.message = 'Token expirado ou inválido';
        } else if (error.response?.status === 403) {
          apiError.message = 'Acesso negado';
        } else if (error.response?.status === 404) {
          apiError.message = 'Recurso não encontrado';
        } else if (error.response?.status === 500) {
          apiError.message = 'Erro interno do servidor';
        } else if (error.code === 'ECONNABORTED') {
          apiError.message = 'Timeout da requisição';
        } else if (error.message === 'Network Error') {
          apiError.message = 'Erro de conexão';
        } else if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          apiError.message = (error.response.data as any).message;
        }

        return Promise.reject(apiError);
      }
    );
  }

  // Métodos públicos para uso nos hooks
  public get<T = any>(url: string, params?: any) {
    return this.instance.get<T>(url, { params });
  }

  public post<T = any>(url: string, data?: any) {
    return this.instance.post<T>(url, data);
  }

  public put<T = any>(url: string, data?: any) {
    return this.instance.put<T>(url, data);
  }

  public patch<T = any>(url: string, data?: any) {
    return this.instance.patch<T>(url, data);
  }

  public delete<T = any>(url: string) {
    return this.instance.delete<T>(url);
  }

  // Método para atualizar o token manualmente se necessário
  public updateToken(token: string) {
    this.instance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Método para remover o token
  public removeToken() {
    delete this.instance.defaults.headers.Authorization;
  }
}

// Exportar instância única
export const api = new ApiService();
