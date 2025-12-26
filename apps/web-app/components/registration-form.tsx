'use client'

import { useState, useRef, useEffect } from 'react'
import { startCountdown } from '@monorepo/hello-world'
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Input, Button } from '@monorepo/web-ui'

export function RegistrationForm() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isCountdownActive, setIsCountdownActive] = useState(false)
  const stopCountdownRef = useRef<(() => void) | null>(null)

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (stopCountdownRef.current) {
        stopCountdownRef.current()
      }
    }
  }, [])

  const handleSendCode = () => {
    const trimmedPhone = phone.trim()

    if (!trimmedPhone) {
      alert('请输入手机号')
      return
    }

    if (isCountdownActive) {
      return
    }

    setIsCountdownActive(true)
    setCountdown(60)

    stopCountdownRef.current = startCountdown({
      seconds: 60,
      onTick: (remaining) => {
        setCountdown(remaining)
      },
      onDone: () => {
        setIsCountdownActive(false)
        setCountdown(0)
        stopCountdownRef.current = null
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Registration logic would go here
    console.log('Registration submitted:', { phone, code })
  }

  const getSendButtonText = () => {
    if (!isCountdownActive && countdown === 0) return '发送验证码'
    if (isCountdownActive && countdown > 0) return `重新发送 (${countdown}s)`
    return '重新发送'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>用户注册</CardTitle>
        <CardDescription>输入手机号，获取验证码后完成注册</CardDescription>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Input
            type="text"
            placeholder="手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="grid grid-cols-[1fr_auto] gap-2.5 items-center">
            <Input
              type="text"
              placeholder="验证码"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSendCode}
              disabled={isCountdownActive}
            >
              {getSendButtonText()}
            </Button>
          </div>
          <Button type="submit" variant="primary">
            完成注册
          </Button>
          <p className="text-xs text-web-ui-ink-muted m-0">
            仅做演示，不会真的发送短信。
          </p>
        </form>
      </CardBody>
    </Card>
  )
}
