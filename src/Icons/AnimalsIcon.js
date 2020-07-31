import * as React from "react";

function AnimalsIcon(props) {
  return (
    <svg viewBox="0 0 512 512" width="1em" height="1em" {...props}>
      <path d="M38.566 226.524c-1.773 6.146-3.234 16.026 1.371 25.452 4.4 9 13.011 15.28 25.613 18.712 13.409 45.769 32.841 83.082 57.8 110.956 33 36.867 75.05 56.417 125.051 58.207L261.205 474l-30.774 6.155a8 8 0 103.138 15.69l74.008-14.8 5.268 10.535a8 8 0 1014.31-7.156l-8-16a8.005 8.005 0 00-8.724-4.267l-33.331 6.664-11.766-31.37a203.1 203.1 0 0088.275-30.945c28.49-18.291 51.477-43.434 68.324-74.728 19.97-37.1 31.256-82.935 33.591-136.333a30.743 30.743 0 002.766-.775 22.32 22.32 0 0014.606-14.8c2.33-7.493 1.006-16.66-3.219-22.293L464 152h24a8 8 0 007.845-9.569c-4.934-24.67-20.528-33.819-32.74-37.149a53.818 53.818 0 00-7.578-1.476 53.959 53.959 0 00-1.091-4.9 33.547 33.547 0 0015.881-19.5 23.594 23.594 0 00-3.339-21.438A24.131 24.131 0 00447.48 48h-.851A24.042 24.042 0 00424 32h-1.371A24.042 24.042 0 00400 16h-16a8 8 0 00-8 8v45.483c-25.135 12.759-35.251 45.118-42.463 68.2-2.511 8.035-5.852 18.73-8.426 22.316H89.45L26.809 136.51a8 8 0 00-10.728 6.358c-.338 2.364-7.55 55.706 22.485 83.656zm419.054-49.408a6.377 6.377 0 01-4.432 4.39 14.355 14.355 0 01-10.456-.61 7.87 7.87 0 01-4.6-5.232 7.984 7.984 0 011.32-6.939L448 157.333l8.879 11.839c.792 1.056 1.745 4.715.741 7.944zm1.737-56.268A26.768 26.768 0 01477.133 136H448v-16.649a41.581 41.581 0 0111.357 1.497zM392 32h8a8.009 8.009 0 018 8 8 8 0 008 8h8a8.009 8.009 0 018 8 8 8 0 008 8h7.48a7.98 7.98 0 016.532 3.345 7.757 7.757 0 011.113 7.044 17.86 17.86 0 01-7.5 9.919 43.461 43.461 0 00-2.3-2.992C435.562 69.826 420.312 64 400 64a58.749 58.749 0 00-8 .535zm-43.191 110.455C359.485 108.285 370.707 80 400 80c15.786 0 34.485 4.4 39.252 24.012-.467.075-.753.13-.821.143A8 8 0 00432 112v32a7.964 7.964 0 002.022 5.3l-7.366 9.821a23.992 23.992 0 009.94 36.549q1.465.607 2.928 1.068c-2.219 50.732-12.765 94.11-31.424 128.982-15.44 28.853-36.464 52.035-62.486 68.9C301.02 423.525 256.433 424 256 424c-102.228 0-150.225-78.87-172.715-150.009l33.089 5.515c10.647 9.42 64.3 53.83 129.183 53.829q3.607 0 7.263-.187c39.442-2.044 74.845-20.854 105.225-55.908 28.155-32.483 37.534-59.679 27.875-80.833-5.964-13.061-18.743-22.855-37.982-29.108-2.452-.8-4.928-1.506-7.41-2.144 2.996-5.806 5.42-13.546 8.281-22.7zM296 176c46.459 0 69.394 13.975 75.366 27.054 6.728 14.735-2.059 36.764-25.411 63.707-27.4 31.609-58.977 48.568-93.868 50.4-54.494 2.876-103.25-31.877-120.234-45.581 19.284-18.712 79.286-75.439 118.078-95.583zm-200.8 0h124.2c-37.9 26.087-81.869 67.728-98.41 83.812-9.467-13.94-28.375-46.826-25.79-83.812zm-64.009-20.759L79.356 173.3c-3.129 36.8 12.051 69.234 23.293 87.7l-29.211-4.868C63.422 254.1 57 250.369 54.35 245.027c-3.827-7.711.779-17.394.8-17.448a8 8 0 00-2.35-9.979c-20.185-15.139-22.1-46.274-21.609-62.359z" />
      <circle cx={408} cy={112} r={8} />
    </svg>
  );
}

const MemoAnimalsIcon = React.memo(AnimalsIcon);
export default MemoAnimalsIcon;
