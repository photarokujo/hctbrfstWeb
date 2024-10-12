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

  return (
    <>
      <div className="w-full min-h-screen bg-[#0A0E0C] p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          Backslash Hacktoberfest 2024 Contributors
        </h1>

        {loading ? (
          <div className="text-center py-10 text-white">Loading contributors...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:scale-90">
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
        )}
      </div>

      <footer className="bg-[#0A0E0C] text-[#F4E9D8] py-8 border-t border-[#162414]">
        <div className="container mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold mb-4 text-[#AEF359]">About Hacktoberfest</h3>
            <p className="text-md text-[#B2B2B2]">
              Hacktoberfest is a month-long celebration of open source software, powered by DigitalOcean. Join developers around the globe by contributing to open-source projects and making your mark in the community.
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <h3 className="text-2xl font-semibold mb-4 text-[#AEF359]">Contact</h3>
            <p className="text-md text-[#B2B2B2] mb-2">Email: <a href="mailto:backslash@thapar.edu" className="text-[#AEF359] hover:underline">backslash_sc@thapar.edu</a></p>
            <p className="text-sm text-[#B2B2B2]">Address: Hoga kisi jungle me</p>
          </div>
        </div>
      </footer>
    </>
  )
}
