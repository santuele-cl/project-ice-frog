import { SvgIcon } from "@mui/material";

export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <SvgIcon sx={{ fontSize: size }}>
      <svg
        fill="#000000"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="800px"
        height="800px"
        viewBox="0 0 503.2 503.2"
        xmlSpace="preserve"
      >
        <g>
          <path
            d="M404.601,299.199c-26.105,0-49.776,10.221-67.415,26.785L272.001,277.1v-74.664c46.335-8.071,81.6-48.389,81.6-97.036
      c0-54.454-44.146-98.6-98.6-98.6c-54.455,0-98.601,44.146-98.601,98.6c0,48.647,35.265,88.965,81.6,97.036v74.439l-70.101,50.286
      c-12.886-12.642-29.267-21.732-47.58-25.643C52.014,286.939-7.69,343.168,0.81,410.617c5.536,43.949,41.024,79.432,84.973,84.974
      c67.449,8.5,123.678-51.204,109.099-119.518c-1.584-7.432-4.06-14.531-7.242-21.229l67.137-48.164l61.981,46.484
      c-6.827,13.417-10.757,28.554-10.757,44.636c0,54.454,44.146,98.6,98.6,98.6s98.6-44.146,98.6-98.6
      C503.2,343.345,459.055,299.199,404.601,299.199z M98.601,333.213c16.395,0,29.689,13.294,29.689,29.689
      c0,16.395-13.294,29.688-29.689,29.688s-29.689-13.294-29.689-29.688C68.912,346.5,82.206,333.213,98.601,333.213z M142.801,448.8
      H54.4v-13.328c0-18.217,12.784-34.272,31.008-34.272h26.391c18.217,0,31.001,16.056,31.001,34.272V448.8z M255.001,40.813
      c16.395,0,29.688,13.294,29.688,29.688c0,16.395-13.294,29.689-29.688,29.689c-16.395,0-29.689-13.294-29.689-29.689
      C225.312,54.101,238.606,40.813,255.001,40.813z M210.801,156.399v-13.328c0-18.217,12.784-34.272,31.008-34.272h26.391
      c18.218,0,31.001,16.055,31.001,34.272v13.328H210.801z M404.601,333.213c16.395,0,29.688,13.294,29.688,29.689
      c0,16.395-13.294,29.688-29.688,29.688s-29.688-13.294-29.688-29.688C374.912,346.5,388.206,333.213,404.601,333.213z
      M448.801,448.8h-88.4v-13.328c0-18.217,12.784-34.272,31.008-34.272H417.8c18.217,0,31.001,16.056,31.001,34.272V448.8z"
          />
        </g>
      </svg>
    </SvgIcon>
  );
}