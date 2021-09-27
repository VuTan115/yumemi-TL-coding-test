import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import instance from '../../api/axios'
import endPoints from '../../enums/endpoints'
import { getPopulationCompitions } from '../../api/populations'
import { ApexOptions } from 'apexcharts'
// 人口数 都道府県

export default function MyChart() {
  const [loading, setLoading] = useState(true)
  const [prefectures, setPrefectures] = useState([])
  const [xaxisCategories, setXaxisCategories] = useState([0])

  /* chart config */
  const options: ApexOptions = {
    chart: {
      // redrawOnParentResize: true,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
          customIcons: [],
        },
        autoSelected: 'selection',
      },
    },
    stroke: {
      lineCap: 'butt',
    },
    xaxis: {
      type: 'category',
      categories: xaxisCategories,
      labels: {
        show: true,
        offsetX: 0,
        style: {
          cssClass: 'xaxis-label',
        },
      },
      title: {
        text: '年度',
        offsetX: 0,
        offsetY: 0,
        style: {
          cssClass: 'xaxis-title axis-title',
        },
      },
    },
    legend: {
      showForSingleSeries: true,
      showForZeroSeries: false,
      showForNullSeries: false,
      offsetY: 80,
      position: 'right',
    },
    title: {
      text: '市町村別の人口推移を表したグラフ',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#263238',
      },
    },
    yaxis: {
      show: true,
      showAlways: true,
      title: {
        rotate: 360,
        text: '人口数',
        style: {
          cssClass: 'yaxis-title axis-title',
        },
      },
    },
    // dataLabels: {
    //   enabled: true,
    //   textAnchor: 'middle',
    //   distributed: false,
    //   offsetX: 0,
    //   offsetY: 0,
    //   style: {
    //     cssClass: 'data-label'
    //   },
    //   background: {
    //     enabled: true,
    //     foreColor: '#fff',
    //     padding: 4,
    //     borderRadius: 2,
    //     borderWidth: 1,
    //     borderColor: '#fff',
    //     opacity: 0.9,
    //     dropShadow: {
    //       enabled: false,
    //       top: 1,
    //       left: 1,
    //       blur: 1,
    //       color: '#000',
    //       opacity: 0.45
    //     }
    //   },
    //   dropShadow: {
    //     enabled: false,
    //     top: 1,
    //     left: 1,
    //     blur: 1,
    //     color: '#000',
    //     opacity: 0.45
    //   }
    // },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            offsetY: 0,
            position: 'top',
          },

          title: {
            text: '',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          xaxis: {
            title: {
              text: '年度',
              style: {
                cssClass: '',
              },
            },
          },
          yaxis: {
            title: {
              text: '人口数',
            },
          },
        },
      },
    ],
  }
  /* chart data */
  const [series, setSeries] = useState([{ id: '', name: '', data: [0] }])

  const seriesConverter = (
    prefCode: number,
    data: [{ year: number; value: number }] | never[],
    prefName: string
  ) => {
    const dummyArr: number[] = []
    data.forEach((element: { value: number }) => {
      dummyArr.push(element.value)
    })
    return { id: `${prefCode}`, name: prefName, data: dummyArr }
  }
  const getPopulation = async (prefCode: number) => {
    const dummyVar = await getPopulationCompitions(prefCode)
    if (dummyVar.status && dummyVar.data.result.data) {
      const data: [{ year: number; value: number }] = dummyVar.data.result.data[0].data
      return data
    }
    return []
  }

  const updateXaxisLable = (data: [{ year: number; value: number }] | never[]) => {
    if (data != []) {
      const years: number[] = []
      data.forEach((element: { year: number }) => {
        years.push(element.year)
      })
      setXaxisCategories(years)
    }
  }
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get(endPoints.PREFECTURES)
        if (response.status < 400) {
          const firstPrefecture = response.data.result[0]
          const data: [{ year: number; value: number }] | never[] = await getPopulation(
            firstPrefecture.prefCode
          )
          updateXaxisLable(data)
          const firstSeries = seriesConverter(
            firstPrefecture.prefCode,
            data,
            firstPrefecture.prefName
          )
          setSeries([firstSeries])
          setPrefectures(response.data.result)
          setLoading(false)
        }
        return ''
      } catch (error) {
        return error
      }
    }
    fetchData()
  }, [])

  const removeSeries = (prefCode: number) => {
    const checkboxID = prefCode.toString()
    const newSeries = series.filter((element) => element.id !== checkboxID)
    setSeries(newSeries)
  }

  const addSeries = async (prefCode: number, prefName: string) => {
    try {
      const data = await getPopulation(prefCode)
      const newSeries = seriesConverter(prefCode, data, prefName)
      setLoading(false)
      if (data != []) {
        setSeries([...series, newSeries])
      }
      return ''
    } catch (error) {
      return error
    }
  }
  const checkboxChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.id)
    const prefCode: number = parseInt(event.target.id)
    const prefName = event.target.value
    const checkStatus = event.target.checked
    if (!checkStatus) {
      removeSeries(prefCode)
    } else {
      setLoading(true)
      addSeries(prefCode, prefName)
    }
  }

  return (
    <>
      <div className="container ">
        <div className="card">
          <div className={loading ? '' : 'hidden'}>
            <div className="overlay" />
            <div className="dashed-loading" />
          </div>
          <span className="prefectures-title">都道府県</span>
          <div className="filter" onChange={checkboxChecked}>
            {prefectures.map((prefecture: { prefCode: number; prefName: string }) => (
              <label
                className="filter-items"
                htmlFor={prefecture.prefCode + ''}
                key={prefecture.prefCode}
              >
                <input
                  type="checkbox"
                  name="filter-items"
                  id={prefecture.prefCode + ''}
                  value={prefecture.prefName}
                  defaultChecked={prefecture.prefCode === 1}
                />
                <span className="label">{prefecture.prefName}</span>
              </label>
            ))}
          </div>

          <div id="chart">
            <Chart options={{ ...options }} series={series} height="100%" width="100%" />
          </div>
        </div>
      </div>
    </>
  )
}
