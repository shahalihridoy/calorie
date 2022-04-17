import { SxProps } from "@mui/material";
import Image, { ImageProps } from "next/image";
import { Span } from "./Typography";

type NextImageProps = {
  sx?: SxProps;
  children?: never;
};

const NextImage: React.FC<NextImageProps & ImageProps> = ({ sx, ...props }) => (
  <Span sx={{ lineHeight: 0, ...sx }}>
    <Image alt="next-image" {...props} />
  </Span>
);

export default NextImage;
