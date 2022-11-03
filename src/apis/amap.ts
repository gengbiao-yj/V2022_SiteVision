/**
 * 第三方 - 高德地图 API
 */
import axios from 'axios';
import { AMAP } from '@/plugin/Axios/config';
import { FeatureCollection, GeoJsonProperties, Polygon } from 'geojson';

// IP 定位
const amapIP = async () => {
  try {
    const { data } = await axios.get('https://restapi.amap.com/v3/ip', {
      params: {
        key: AMAP.AMAP_WEBKEY
      }
    });
    return Promise.resolve(data) as Promise<AmapV3IP>;
  } catch (error) {
    return Promise.reject(error);
  }
};

// mapbox isochrone 导航 - 交通工具行驶范围计算
const mapBoxIsochrone = async (
  type: 'walking' | 'cycling' | 'driving',
  lng: number,
  lat: number,
  minutes: number
) => {
  try {
    const { data } = await axios.get(
      `https://api.mapbox.com/isochrone/v1/mapbox/${type}/${lng},${lat}`,
      {
        params: {
          contours_minutes: minutes,
          polygons: true,
          denoise: 1,
          generalize: 1,
          access_token: AMAP.AMAP_ACCESSTOKEN
        }
      }
    );
    return Promise.resolve(data) as Promise<
      FeatureCollection<Polygon, GeoJsonProperties>
    >;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { amapIP, mapBoxIsochrone };
