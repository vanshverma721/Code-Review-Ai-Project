import { useEffect, useState } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import axios from 'axios'
import Markdown from "react-markdown"
import './App.css'

function App() {

  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  })

  async function reviewCode() {

    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error("Error fetching review:", error)
      setReview("An error occurred while fetching the review.")
    } finally {
      setLoading(false) // Set loading to false once fetching is done
    }
  }

  return (
    <>
      <main>

        <div className="left">

          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                widows: "100%"
              }}
            />
          </div>

          <div className="review-button" onClick={reviewCode}>
            {loading ? "Loading..." : "Review"}
          </div>

        </div>

        <div className="right">
          {loading ? <div className="spinner"></div> : <Markdown>{review}</Markdown>}
        </div>

      </main>
    </>
  )
}


export default App
