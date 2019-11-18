import axios from 'axios'

const URL =  'http://192.168.10.246:5000'
const doRequest = async (url, options) => {
    const log = {
      request: {
        url: url.href,
        parameter: options,
      },
    }
    try {
      const response = await axios({ ...options, url, timeout: 10000 })
      if (response.status >= 200 && response.status < 300) {
        const json = response.data
        log.response = json
        return json
       
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response
        log.response = data
        }
    }
    return null
  }


export const postImage = (fetchData) => {
    const url = `${URL}/image/faces`
  
    const form = new FormData()
    form.append('image',fetchData.image)
   
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: form,
    }

    return doRequest(url, options)
  }