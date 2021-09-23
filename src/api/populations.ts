import endPoints from '../enums/endpoints'
import instance from './axios'

export const getPopulationCompitions = (prefCode: number) => {
  const url = `${endPoints.POPULATION}?prefCode=${prefCode}`
  return instance.get(url)
}
