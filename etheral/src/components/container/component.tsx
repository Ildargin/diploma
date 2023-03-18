import './component.scss'

type Props = React.HTMLAttributes<HTMLDivElement>

export const Container = ({ children, className = '', ...rest }: Props) => (
  <div className={`container ${className}`} {...rest}>
    {children}
  </div>
)
