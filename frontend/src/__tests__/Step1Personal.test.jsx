import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Step1Personal from '../components/Form/Step1Personal'

describe('Step1Personal', () => {
  const defaultProps = {
    data: { name: '', phone_email: '', relationship: 'Teman' },
    onChange: vi.fn(),
    onNext: vi.fn(),
  }

  it('renders all form fields', () => {
    render(<Step1Personal {...defaultProps} />)
    expect(screen.getByPlaceholderText('Masukkan nama lengkap')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('0812xxxx atau email@example.com')).toBeInTheDocument()
    expect(screen.getByText('Teman')).toBeInTheDocument()
    expect(screen.getByText('Keluarga')).toBeInTheDocument()
    expect(screen.getByText('Rekan Kerja')).toBeInTheDocument()
    expect(screen.getByText('Lainnya')).toBeInTheDocument()
  })

  it('disables submit when name is empty', () => {
    render(<Step1Personal {...defaultProps} />)
    expect(screen.getByText('Lanjut')).toBeDisabled()
  })

  it('enables submit when name is filled', () => {
    render(<Step1Personal {...defaultProps} data={{ name: 'John', phone_email: '', relationship: 'Teman' }} />)
    expect(screen.getByText('Lanjut')).toBeEnabled()
  })

  it('calls onNext on valid submit', async () => {
    const onNext = vi.fn()
    render(<Step1Personal {...defaultProps} data={{ name: 'John', phone_email: '', relationship: 'Teman' }} onNext={onNext} />)
    await userEvent.click(screen.getByText('Lanjut'))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('shows error for invalid email format', () => {
    render(<Step1Personal {...defaultProps} data={{ name: 'John', phone_email: 'notanemail', relationship: 'Teman' }} />)
    expect(screen.getByText('Masukkan email valid atau nomor HP (08xx)')).toBeInTheDocument()
  })

  it('shows error for invalid phone number', () => {
    render(<Step1Personal {...defaultProps} data={{ name: 'John', phone_email: '12345', relationship: 'Teman' }} />)
    expect(screen.getByText('Masukkan email valid atau nomor HP (08xx)')).toBeInTheDocument()
  })

  it('accepts valid email', () => {
    render(<Step1Personal {...defaultProps} data={{ name: 'John', phone_email: 'john@example.com', relationship: 'Teman' }} />)
    expect(screen.queryByText('Masukkan email valid atau nomor HP (08xx)')).not.toBeInTheDocument()
    expect(screen.getByText('Lanjut')).toBeEnabled()
  })

  it('accepts valid phone number starting with 08', () => {
    render(<Step1Personal {...defaultProps} data={{ name: 'John', phone_email: '08123456789', relationship: 'Teman' }} />)
    expect(screen.queryByText('Masukkan email valid atau nomor HP (08xx)')).not.toBeInTheDocument()
    expect(screen.getByText('Lanjut')).toBeEnabled()
  })
})
