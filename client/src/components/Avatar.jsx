import { PiUserCircle } from "react-icons/pi";

const Avatar = ({  name, imageUrl, width, height }) => {


    let avatarName = ""

    if (name) {
        const splitName = name?.split(" ")

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }

    const bgColor = [
        'bg-slate-400',
        'bg-teal-400',
        'bg-red-400',
        'bg-green-400',
        'bg-yellow-400',
        'bg-gray-400',
        "bg-cyan-400",
        "bg-sky-400",
        "bg-blue-400"
    ]

    const randomNumber = Math.floor(Math.random() * 9)



    return (
        <div className={`text-slate-800  rounded-full font-bold relative`} style={{ width: width + "px", height: height + "px" }}>
            {
                (imageUrl && imageUrl!="default.png") ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    name ? (
                        <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                            {avatarName}
                        </div>
                    ) : (
                        <PiUserCircle
                            size={width}
                        />
                    )
                )
            }


        </div>
    )
}

export default Avatar
