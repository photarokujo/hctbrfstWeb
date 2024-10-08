'use client'

import { useState, useEffect } from 'react'
import { GithubIcon } from 'lucide-react'
import "./App.css"

const REPO_OWNER = 'photarokujo'
const REPO_NAME = 'RPG-Game'

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
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`)
        if (!response.ok) {
          throw new Error('Failed to fetch contributors')
        }
        const data = await response.json()
        setContributors(data)
      } catch (err) {
        setError('Error fetching contributors. Please try again later.')
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-white mb-12">
        Hacktoberfest 2024 Contributors
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {contributors.map((contributor) => (
          <div
            key={contributor.login}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={contributor.avatar_url}
              alt={`${contributor.login}'s avatar`}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{contributor.login}</h2>
              <p className="text-sm text-gray-600 mb-4">
                Contributions: <span className="text-red-500">{contributor.contributions}</span>
              </p>
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                <GithubIcon className="mr-2 h-5 w-5" />
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
