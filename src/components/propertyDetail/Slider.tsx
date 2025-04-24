/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import style from "./property.module.css";

import Eye from "../svgs/Eye";
import { cn } from "@/lib/utils";
const Slider = ({ images, property }: { images: any[]; property: any }) => {
  return (
    <div className='relative h-[500px] sm:h-[560px]'>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        className='h-[500px]'
      >
        {images.map((image: any) => (
          <SwiperSlide>
            <img
              src={image ? image.image : "No Photos"}
              alt='img'
              className='w-full h-full object-cover rounded-b-[8px]'
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      <button className='swiper-button-prev absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white rounded-sm  shadow-md'>
        <ChevronLeft className='h-5 w-5' />
      </button>
      <button className='swiper-button-next absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white rounded-sm  shadow-md'>
        <ChevronRight className='h-5 w-5' />
      </button>

      {/* Badges */}
      <div className='absolute top-4 left-4 z-10 flex items-center bg-white rounded-[4px] border-2 border-white '>
        <div className={cn("capitalize", style.badge)}>{property.status}</div>
      </div>
      <div className='absolute top-4 right-4 z-10 flex gap-2 max-sm:hidden '>
        <div className={style.badge}>
          <Eye />
          <span className='ml-2 capitalize'>{property.property_type}</span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
