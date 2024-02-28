import Image from "next/image"

const Logo = () => {
    return (
        <Image
            width={50}
            height={50}
            src="/logo.png"
            alt="logo"
        />
      );
}
 
export default Logo;