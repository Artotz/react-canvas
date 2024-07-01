import { useEffect, useState } from "react";

export default function MainInterface() {
  //   const [currentText, setCurrentText] = useState("");
  //   const [currentIndex, setCurrentIndex] = useState(0);
  //   const [textDeleting, setTextDeleting] = useState(false);

  //   var text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis sodales libero, et facilisis mauris facilisis eu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam non quam viverra odio maximus egestas non sed turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum ultricies ligula non tellus tempus, quis faucibus augue efficitur. Nulla vel neque sed risus malesuada efficitur ac ut purus. Donec pharetra felis tincidunt tortor commodo, sed consequat dolor euismod. Praesent id imperdiet ipsum. Duis molestie velit velit, ac ultricies tellus tristique eget.
  // Donec fermentum a elit at bibendum. Donec et sem eget turpis auctor ullamcorper. Integer nec lacus odio. Donec id commodo sem. Praesent quis nunc eget turpis tristique pellentesque. Proin id eros congue, eleifend ligula quis, lobortis nunc. Sed fringilla, nunc id accumsan tincidunt, nunc velit ornare lacus, ac viverra elit nisi eu enim. Fusce sed laoreet ipsum.
  // Duis orci nisl, vulputate vel ligula sed, elementum malesuada neque. Vivamus mattis, quam et efficitur consequat, sem nibh vestibulum libero, id facilisis diam eros ut nibh. Phasellus vel pulvinar felis, id accumsan massa. Sed sed velit velit. Proin nec condimentum felis. Nulla in lectus quis nisl pellentesque rutrum. Suspendisse sit amet sapien pharetra, volutpat orci at, sagittis arcu. Sed volutpat sem sed libero bibendum volutpat. Phasellus interdum neque velit, vel semper sem suscipit ac. Integer ac mauris placerat ligula posuere lobortis.
  // Nam eget viverra justo. Curabitur laoreet tempor molestie. Proin malesuada felis at libero fermentum volutpat. Curabitur ac rhoncus turpis, in tempor tellus. Vivamus sit amet nisi vel mauris porttitor imperdiet. Sed mi ante, iaculis non metus eleifend, lacinia sodales felis. Maecenas rutrum leo ligula, ac condimentum tortor aliquam eu.
  // Mauris euismod congue dui, ut lobortis ligula tincidunt convallis. Aenean eleifend metus at venenatis aliquet. Fusce sit amet lacus est. Quisque quis feugiat mauris. Suspendisse ut fringilla elit, ut semper enim. Fusce non ex velit. Pellentesque pretium id felis et dictum.`;
  //   var delay = 10;

  //   useEffect(() => {
  //     let timeout: number;

  //     if (!textDeleting) {
  //       timeout = setTimeout(() => {
  //         setCurrentText((prevText) => prevText + text[currentIndex]);
  //         setCurrentIndex((prevIndex) => prevIndex + 1);
  //       }, delay);
  //       if (currentIndex == text.length - 1) setTextDeleting(true);
  //     } else {
  //       timeout = setTimeout(() => {
  //         setCurrentText((prevText) =>
  //           prevText.substring(0, prevText.length - 1)
  //         );
  //         setCurrentIndex((prevIndex) => prevIndex - 1);
  //       }, delay / 2);
  //       if (currentIndex == 1) setTextDeleting(false);
  //     }

  //     return () => clearTimeout(timeout);
  //   }, [currentIndex, delay, text]);

  return (
    <div className="flex flex-col w-full h-full bg-black justify-center items-center text-green-500">
      <div className="flex w-full h-full gap-4 p-4">
        {/* TEXT */}
        {/* <div className="flex w-full h-full border-green-500 border-solid border-2 p-2 overflow-y-hidden">
        <div className="flex w-full px-2 text-start text-2xl overflow-y-scroll">{`${currentText} <`}</div>
      </div> */}
        {/* BUTTONS */}
        <div className="grid grid-rows-5 grid-flow-col h-full gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => {
            return (
              <div className="flex flex-col w-16 h-20 border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-end cursor-pointer select-none p-2 gap-2">
                <div className="flex w-full h-full bg-blue-500"></div>
                <div className="flex ">bruh{v}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex w-full h-12 border-solid border-2 border-green-500 p-2">
        <div className="flex w-content flex-col border-green-500 border-solid border-2 hover:bg-green-500 hover:text-black justify-center items-center cursor-pointer select-none">
          <div className="flex px-2">iniciar</div>
        </div>
      </div>
    </div>
  );
}
