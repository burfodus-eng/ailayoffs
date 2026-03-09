'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, Shield, AlertTriangle, CheckCircle, ExternalLink, Loader2 } from 'lucide-react'

const steps = [
  { id: 'role', title: 'Your Role', description: 'Tell us about your current position' },
  { id: 'tasks', title: 'Your Tasks', description: 'What does your day look like?' },
  { id: 'context', title: 'Context', description: 'Industry and location details' },
  { id: 'results', title: 'Your Results', description: 'AI displacement risk assessment' },
]

const taskOptions = [
  'Data entry and processing',
  'Customer service / support',
  'Writing and content creation',
  'Financial analysis / accounting',
  'Software development / coding',
  'Sales and lead generation',
  'Administrative / scheduling',
  'Design and creative work',
  'Physical / manual labor',
  'Research and analysis',
  'Teaching / training',
  'Healthcare / patient care',
  'Legal research / compliance',
  'Marketing and advertising',
  'Supply chain / logistics',
  'Management / leadership',
]

const experienceLevels = ['Entry level (0-2 years)', 'Mid level (3-7 years)', 'Senior (8-15 years)', 'Executive (15+ years)']

const upskillPlatforms = [
  {
    name: 'Coursera',
    description: 'University-backed courses in AI, data science, and emerging tech',
    url: 'https://www.coursera.org',
    tag: 'Most Popular',
    categories: ['AI & Machine Learning', 'Data Science', 'Cloud Computing'],
  },
  {
    name: 'Udemy',
    description: 'Affordable practical courses on AI tools, automation, and tech skills',
    url: 'https://www.udemy.com',
    tag: 'Best Value',
    categories: ['AI Tools', 'Prompt Engineering', 'No-Code Automation'],
  },
  {
    name: 'LinkedIn Learning',
    description: 'Professional development courses with career-focused certifications',
    url: 'https://www.linkedin.com/learning',
    tag: 'Career Growth',
    categories: ['Leadership', 'AI Strategy', 'Digital Transformation'],
  },
  {
    name: 'Google Career Certificates',
    description: 'Industry-recognized credentials in high-growth tech fields',
    url: 'https://grow.google/certificates',
    tag: 'Industry Recognized',
    categories: ['Data Analytics', 'Cybersecurity', 'Project Management'],
  },
  {
    name: 'Skillshare',
    description: 'Creative and design skills that complement AI capabilities',
    url: 'https://www.skillshare.com',
    tag: 'Creative Skills',
    categories: ['UX Design', 'Visual Communication', 'Creative AI'],
  },
]

interface AssessmentResult {
  riskScore: number
  aiRiskScore: number
  roboticsRiskScore: number
  timeHorizon: string
  reasoning: string
  suggestions: string[]
  adjacentRoles: string[]
  error?: string
}

export function JobSecurityClient() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  // Form state
  const [jobTitle, setJobTitle] = useState('')
  const [experience, setExperience] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [industry, setIndustry] = useState('')
  const [country, setCountry] = useState('')
  const [education, setEducation] = useState('')

  const toggleTask = (task: string) => {
    setSelectedTasks(prev =>
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    )
  }

  const canProceed = () => {
    if (currentStep === 0) return jobTitle.trim().length > 0
    if (currentStep === 1) return selectedTasks.length > 0
    if (currentStep === 2) return true
    return false
  }

  const handleSubmit = async () => {
    setLoading(true)
    setCurrentStep(3)

    try {
      const res = await fetch('/api/job-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          experience,
          tasks: selectedTasks,
          industry,
          country,
          education,
        }),
      })
      if (res.ok) {
        setResult(await res.json())
      } else {
        setResult({
          riskScore: 0, aiRiskScore: 0, roboticsRiskScore: 0,
          timeHorizon: '', reasoning: '', suggestions: [], adjacentRoles: [],
          error: 'Analysis temporarily unavailable. Please try again later.',
        })
      }
    } catch {
      setResult({
        riskScore: 0, aiRiskScore: 0, roboticsRiskScore: 0,
        timeHorizon: '', reasoning: '', suggestions: [], adjacentRoles: [],
        error: 'Connection error. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500'
    if (score >= 40) return 'text-amber-500'
    return 'text-green-500'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk'
    if (score >= 40) return 'Moderate Risk'
    return 'Lower Risk'
  }

  const getRiskBg = (score: number) => {
    if (score >= 70) return 'bg-red-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-green-500'
  }

  const resetAssessment = () => {
    setCurrentStep(0)
    setResult(null)
    setJobTitle('')
    setExperience('')
    setSelectedTasks([])
    setIndustry('')
    setCountry('')
    setEducation('')
  }

  return (
    <div>
      {/* Progress Bar */}
      {currentStep < 3 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.slice(0, 3).map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
                {i < 2 && <div className={`w-8 sm:w-16 h-0.5 ${i < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-700'}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Role */}
      {currentStep === 0 && (
        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold mb-1">{steps[0].title}</h2>
              <p className="text-muted-foreground text-sm">{steps[0].description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Financial Analyst, Truck Driver, Software Engineer"
                className="w-full border border-input bg-background rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Experience Level</label>
              <div className="grid grid-cols-2 gap-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setExperience(level)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      experience === level
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        : 'border-input hover:border-blue-300 bg-background'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Education / Credentials</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g. Bachelor's in Finance, CPA, No formal degree"
                className="w-full border border-input bg-background rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(1)} disabled={!canProceed()} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Tasks */}
      {currentStep === 1 && (
        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold mb-1">{steps[1].title}</h2>
              <p className="text-muted-foreground text-sm">Select all tasks that are part of your regular work</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {taskOptions.map((task) => (
                <button
                  key={task}
                  onClick={() => toggleTask(task)}
                  className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                    selectedTasks.includes(task)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'border-input hover:border-blue-300 bg-background'
                  }`}
                >
                  {task}
                </button>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">{selectedTasks.length} selected</p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(0)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(2)} disabled={!canProceed()} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Context */}
      {currentStep === 2 && (
        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold mb-1">{steps[2].title}</h2>
              <p className="text-muted-foreground text-sm">{steps[2].description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Finance, Healthcare, Manufacturing, Retail"
                className="w-full border border-input bg-background rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Australia, United States, United Kingdom"
                className="w-full border border-input bg-background rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSubmit} className="gap-2 bg-blue-600 hover:bg-blue-700">
                Analyze My Role <Shield className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {loading ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-lg font-medium">Analyzing your role...</p>
                <p className="text-muted-foreground text-sm mt-1">Evaluating AI and automation risk factors</p>
              </CardContent>
            </Card>
          ) : result?.error ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">{result.error}</p>
                <p className="text-muted-foreground text-sm mb-4">The AI analysis engine requires an API key to be configured on the server.</p>
                <Button variant="outline" onClick={resetAssessment}>Try Again</Button>
              </CardContent>
            </Card>
          ) : result ? (
            <>
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Overall Risk</p>
                    <div className={`text-5xl font-black ${getRiskColor(result.riskScore)}`}>{result.riskScore}</div>
                    <p className="text-sm font-medium mt-1">{getRiskLabel(result.riskScore)}</p>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                      <div className={`h-2 rounded-full ${getRiskBg(result.riskScore)}`} style={{ width: `${result.riskScore}%` }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">AI Risk</p>
                    <div className={`text-5xl font-black ${getRiskColor(result.aiRiskScore)}`}>{result.aiRiskScore}</div>
                    <p className="text-sm font-medium mt-1">{getRiskLabel(result.aiRiskScore)}</p>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                      <div className={`h-2 rounded-full ${getRiskBg(result.aiRiskScore)}`} style={{ width: `${result.aiRiskScore}%` }} />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Robotics Risk</p>
                    <div className={`text-5xl font-black ${getRiskColor(result.roboticsRiskScore)}`}>{result.roboticsRiskScore}</div>
                    <p className="text-sm font-medium mt-1">{getRiskLabel(result.roboticsRiskScore)}</p>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                      <div className={`h-2 rounded-full ${getRiskBg(result.roboticsRiskScore)}`} style={{ width: `${result.roboticsRiskScore}%` }} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              {result.timeHorizon && (
                <Card className="border-border">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Estimated Impact Timeline: <span className="text-blue-600">{result.timeHorizon}</span></p>
                      <p className="text-muted-foreground text-sm">{result.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <Card className="border-border">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" /> How to Future-Proof Your Career
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Adjacent Roles */}
              {result.adjacentRoles && result.adjacentRoles.length > 0 && (
                <Card className="border-border">
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-3">Consider These Adjacent Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.adjacentRoles.map((role, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800">
                          {role}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upskilling Recommendations */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-1">Recommended Learning Platforms</h3>
                <p className="text-muted-foreground text-sm mb-4">Build the skills to stay ahead of AI disruption</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upskillPlatforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="block"
                    >
                      <Card className="border-border hover:border-blue-400 transition-colors h-full">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{platform.name}</h4>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
                              {platform.tag}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">{platform.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {platform.categories.map((cat) => (
                              <span key={cat} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-muted-foreground">
                                {cat}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 text-blue-600 text-sm flex items-center gap-1">
                            Explore courses <ExternalLink className="h-3 w-3" />
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-xs mt-4">
                  Some links may be affiliate links. We only recommend platforms we believe provide genuine value.
                </p>
              </div>

              <div className="text-center mt-6">
                <Button variant="outline" onClick={resetAssessment}>Take Another Assessment</Button>
              </div>
            </>
          ) : null}
        </div>
      )}

      <div className="mt-8 text-center text-muted-foreground text-xs">
        This tool provides estimates only. Individual outcomes vary based on many factors.
        See our <a href="/methodology" className="underline hover:text-foreground">methodology</a>.
      </div>
    </div>
  )
}
