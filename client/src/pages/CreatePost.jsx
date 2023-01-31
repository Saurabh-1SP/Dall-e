import React,{useState} from 'react'
import { json, useNavigate } from 'react-router-dom'

import {preview} from '../assets'
import { Formfield , Loader} from '../component'
import {getRandomPrompt} from '../utils'

const CreatePost = () => {
  const navigate = useNavigate();
  const [ form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  })
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImg = async () => {
    if(form.prompt) {
      try {
        setGenerating(true);
        const response =await fetch('http://localhost:8080/api/v1/dalle',{
          method: 'post',
          headers: {
            'content-Type': 'application/json'
          },
          body:JSON.stringify({ prompt :form.prompt})
        })

        const data = await response.json().catch((error) => {
          alert('gpt');
        });
        

        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})
      } catch (error) {
        alert(error)
      } finally {
        setGenerating(false);
      }
    }else{
      alert('please enter a prompt')
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(form.prompt && form.photo){
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })
        await response.json();
        // console.log(response)
        navigate('/')
      } catch (error) {
        alert('fuck')
      } finally {
        setLoading(false);
        // alert('this fine')
      }
    }
    else{
      alert('please enter a prompt and generate an image')
    }
  }
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }
  const handleSurpriseMe = () =>{
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form,prompt:randomPrompt})
  }
  return (
    <section className='max-w-7xl mx-auto'>
     <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w-[500px]'>Create imaginative and visually stunning images generated through DaALL E AI and share them with the community</p>
      </div>
      <form action="" className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <Formfield
          labelName='Your name'
          type='text'
          name='name'
          placeholder='john doe'
          value={form.name}
          handleChange={handleChange}
          />
          <Formfield
          labelName='prompt'
          type='text'
          name='prompt'
          placeholder='a pencil and watercolor drawing of a bright city in the future with flying cars'
          value={form.prompt}
          handleChange={handleChange}
          isSurpriseMe
          handleSurpriseMe={handleSurpriseMe}
          />

          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ?(
              <img 
              src={form.photo}
              alt={form.prompt}
              className="w-full h-full object-contain"
              />
            ): (
              <img
              src={preview}
              alt='preview'
              className="w-9/12 h-9/12 object-contan opacity-40"
              />
            )}
            {generating && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader/>
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button
          type='button'
          onClick={generateImg}
          className='text-white bg-green-700 font-medium rounded-md text-sm w-full px-5 py-2.5 text-center'
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
          <button
          type='submit'
          className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full  px-5 py-2.5 text-center'>
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost