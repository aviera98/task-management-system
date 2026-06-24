interface AuthSubmitButtonProps {
  idleLabel: string
  loadingLabel: string
  isLoading: boolean
}

export function AuthSubmitButton({
  idleLabel,
  isLoading,
  loadingLabel,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/60"
    >
      {isLoading ? loadingLabel : idleLabel}
    </button>
  )
}
