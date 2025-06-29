import React,{useEffect,useState} from 'react'
import {Helmet} from 'react-helmet'
import supabase from '../lib/supabase'

const CodeSnippetsRenderer=()=> {
  const [snippets,setSnippets]=useState({
    header_code: '',
    footer_code: '',
    body_start_code: '',
    body_end_code: ''
  })
  const [loading,setLoading]=useState(true)

  useEffect(()=> {
    fetchCodeSnippets()
  },[])

  const fetchCodeSnippets=async ()=> {
    try {
      const {data,error}=await supabase
        .from('code_snippets_dk847392')
        .select('*')
        .limit(1)

      if (!error && data && data.length > 0) {
        setSnippets({
          header_code: data[0].header_code || '',
          footer_code: data[0].footer_code || '',
          body_start_code: data[0].body_start_code || '',
          body_end_code: data[0].body_end_code || ''
        })
      }
    } catch (error) {
      console.error('Error fetching code snippets:',error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=> {
    // Inject body start code
    if (snippets.body_start_code && !loading) {
      const bodyStartDiv=document.getElementById('body-start-code')
      if (bodyStartDiv) {
        bodyStartDiv.innerHTML=snippets.body_start_code
      } else {
        // Create div after body tag
        const div=document.createElement('div')
        div.id='body-start-code'
        div.innerHTML=snippets.body_start_code
        document.body.insertBefore(div,document.body.firstChild)
      }
    }

    // Inject body end code
    if (snippets.body_end_code && !loading) {
      const bodyEndDiv=document.getElementById('body-end-code')
      if (bodyEndDiv) {
        bodyEndDiv.innerHTML=snippets.body_end_code
      } else {
        // Create div before closing body tag
        const div=document.createElement('div')
        div.id='body-end-code'
        div.innerHTML=snippets.body_end_code
        document.body.appendChild(div)
      }
    }
  },[snippets,loading])

  if (loading) {
    return null
  }

  return (
    <>
      {/* Header Code - injected into <head> */}
      {snippets.header_code && (
        <Helmet>
          <script type="text/javascript">
            {`
              // Inject header code
              const headerCode = ${JSON.stringify(snippets.header_code)};
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = headerCode;
              Array.from(tempDiv.children).forEach(child => {
                document.head.appendChild(child);
              });
            `}
          </script>
        </Helmet>
      )}

      {/* Footer Code - rendered at bottom of page */}
      {snippets.footer_code && (
        <div 
          id="footer-code"
          dangerouslySetInnerHTML={{__html: snippets.footer_code}}
        />
      )}
    </>
  )
}

export default CodeSnippetsRenderer