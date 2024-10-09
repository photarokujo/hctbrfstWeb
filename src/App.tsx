'use client'

import { useState, useEffect } from 'react'

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const REPO_OWNER = import.meta.env.VITE_REPO_OWNER
const REPO_NAME = import.meta.env.VITE_REPO_NAME

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export default function ContributorsShowcase() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
          throw new Error('Missing environment variables')
        }

        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch contributors')
        }

        const data = await response.json()
        setContributors(data)
      } catch (err) {
        setError(`Error fetching contributors. Please try again later. ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchContributors()
  }, [])

  if (loading) {
    return <div className="text-center py-10 text-white">Loading contributors...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-white mb-12">
        Hacktoberfest 2024 Contributors
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {contributors.map((contributor) => (
          <div
            key={contributor.login}
            className="bg-gray-800 border border-red-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={contributor.avatar_url}
              alt={`${contributor.login}'s avatar`}
              className="w-full object-cover rounded-t-lg"
            />
            <div className="p-6 text-center">
              <h2 className="text-xl max-lg:text-sm font-bold text-white mb-2">{contributor.login}</h2>
              <p className="text-sm text-gray-400 mb-4">
                Contributions: <span className="text-red-500">{contributor.contributions}</span>
              </p>
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
