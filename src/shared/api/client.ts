import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export const baseURL = (() => {
  const url =
    typeof window === 'undefined'
      ? process.env.SERVER_API_URL
      : process.env.NEXT_PUBLIC_BASE_URL

  if (!url) {
    throw new Error('The baseURL API environment variable is not set.')
  }

  return url
})()

const defaultConfig: AxiosRequestConfig = { baseURL }
const defaultAxiosInstance = axios.create(defaultConfig)

export class Client {
  readonly #axiosInstance: AxiosInstance
  static #instance: Client

  constructor(config?: AxiosRequestConfig) {
    if (config) {
      config = { ...defaultConfig, ...config }
      config.headers = { ...defaultConfig.headers, ...(config.headers || {}) }
      this.#axiosInstance = axios.create(config)
    } else {
      this.#axiosInstance = defaultAxiosInstance
    }
  }

  static get Instance() {
    if (!this.#instance) {
      this.#instance = new Client()
    }
    return this.#instance
  }

  async get<T = unknown, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const response = await this.#axiosInstance.get<T, R>(url, config)
    return response
  }

  async post<T = unknown, R = AxiosResponse<T>, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R> {
    const response = await this.#axiosInstance.post<T, R, D>(url, data, config)
    return response
  }
}
