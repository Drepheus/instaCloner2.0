"use client"

import { motion } from "framer-motion"
import { ArrowRight, Link2, Layers, Zap, Shield, Sparkles, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { createDirectUrlJob } from "./actions"
import { useState, useTransition } from "react"
import { cn } from "@/lib/utils"

export default function Home() {
  const [urls, setUrls] = useState("")
  const [parsedUrls, setParsedUrls] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  // Parse URLs from textarea
  const handleUrlChange = (value: string) => {
    setUrls(value)
    // Extract valid Instagram reel URLs
    const lines = value.split(/[\n,\s]+/).filter(Boolean)
    const validUrls = lines.filter(line =>
      line.includes('instagram.com/reel/') ||
      line.includes('instagram.com/p/') ||
      line.includes('instagram.com/reels/')
    )
    setParsedUrls(validUrls)
  }

  return (
    <main className="min-h-screen bg-black text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-24">
      <SiteHeader step={1} />

      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl z-10"
      >
        <div className="flex flex-col items-center space-y-4 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
            Initialize.
          </h1>
          <p className="text-slate-500 text-sm">Paste Instagram reel URLs below (one per line)</p>
        </div>

        <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 md:p-10 space-y-6">
            <form
              action={(formData) => {
                startTransition(async () => {
                  try {
                    await createDirectUrlJob(formData)
                  } catch (error) {
                    console.error("Job creation failed:", error)
                  }
                })
              }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 ml-1">
                    Reel URLs
                  </label>
                  {parsedUrls.length > 0 && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {parsedUrls.length} valid URL{parsedUrls.length !== 1 ? 's' : ''} detected
                    </span>
                  )}
                </div>
                <textarea
                  name="urls"
                  placeholder={`https://instagram.com/reel/ABC123/\nhttps://instagram.com/reel/DEF456/\nhttps://instagram.com/reel/GHI789/`}
                  className="w-full bg-white/5 border border-white/10 min-h-[200px] text-sm px-4 py-4 rounded-2xl focus-visible:ring-emerald-500/50 focus-visible:ring-2 focus-visible:outline-none transition-all font-mono placeholder:text-slate-600 disabled:opacity-50 resize-none"
                  required
                  disabled={isPending}
                  value={urls}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </div>

              {/* URL Preview */}
              {parsedUrls.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                    Detected Reels
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                    {parsedUrls.slice(0, 10).map((url, i) => {
                      const shortcode = url.split('/reel/')[1]?.split('/')[0] ||
                        url.split('/p/')[1]?.split('/')[0] ||
                        `reel-${i}`
                      return (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400"
                        >
                          {shortcode}
                        </span>
                      )
                    })}
                    {parsedUrls.length > 10 && (
                      <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
                        +{parsedUrls.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending || parsedUrls.length === 0}
                className={cn(
                  "w-full h-20 text-xl font-black rounded-2xl transition-all relative overflow-hidden group",
                  isPending
                    ? "bg-emerald-950 text-emerald-500 border border-emerald-500/20 cursor-wait"
                    : parsedUrls.length === 0
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-400 text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
                )}
              >
                {/* Loading Glow & Scan Effect */}
                {isPending && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-emerald-500/5 animate-pulse"
                    />
                    <motion.div
                      className="absolute inset-0 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent w-[100%] -skew-x-12 pointer-events-none"
                        animate={{
                          x: ['-200%', '200%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                  </>
                )}

                <div className="flex items-center justify-center gap-4 relative z-10 w-full">
                  {isPending ? (
                    <>
                      <div className="relative">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 animate-pulse" />
                      </div>
                      <div className="flex flex-col items-start leading-none text-left">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 opacity-70">Processing</span>
                        <span className="text-lg font-black tracking-tight uppercase">Fetching Reels...</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="tracking-tight">
                        {parsedUrls.length === 0 ? 'PASTE URLS ABOVE' : `PROCESS ${parsedUrls.length} REEL${parsedUrls.length !== 1 ? 'S' : ''}`}
                      </span>
                      {parsedUrls.length > 0 && <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />}
                    </>
                  )}
                </div>
              </Button>
            </form>

            <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">How to get reel URLs</p>
              <div className="text-xs text-slate-500 text-center space-y-1">
                <p>1. Open Instagram reel → Click share → Copy link</p>
                <p>2. Paste multiple URLs (one per line)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-white/5 rounded-full backdrop-blur-sm">
            <Link2 className="w-3 h-3 text-emerald-500" /> Direct URLs
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-white/5 rounded-full backdrop-blur-sm">
            <Layers className="w-3 h-3 text-emerald-500" /> Batch Processing
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/5 bg-white/5 rounded-full backdrop-blur-sm">
            <Zap className="w-3 h-3 text-emerald-500" /> No Rate Limits
          </div>
        </div>
      </motion.div>
    </main>
  )
}
