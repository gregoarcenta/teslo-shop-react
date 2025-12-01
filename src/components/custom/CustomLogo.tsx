import { Link } from "react-router";

interface Props {
  subtitle?: string;
  to?: string;
}

const CustomLogo = ({ to, subtitle = "Shop" }: Props) => {
  return (
    <Link to={to ?? "/"} className="flex items-center">
      <span className="font-montserrat font-bold text-xl m-0 whitespace-nowrap">
        Teslo |
      </span>
      <p className="text-muted-foreground m-0 px-2 whitespace-nowrap">
        {subtitle}
      </p>
    </Link>
  );
};

export default CustomLogo;
