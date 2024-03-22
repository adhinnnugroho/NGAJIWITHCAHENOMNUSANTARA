import { useEffect, useState } from "react";
import SholatServices from "@/Services/Sholat";
import BackNavigations from "@/UI/Navigations/BackNavigations";
import MobileNavigations from "@/UI/Navigations/MobileNavigations";
import DateSlider from "@/UI/Date/DateSlider";
import { useTheme } from "next-themes";
import ScheduleCard from "@/Components/Card/ScheduleCard";

const UserLocations = () => {
    const { systemTheme, theme } = useTheme();
    const currentDate: Date = new Date();

    const GetDate = {
        'day': currentDate.getDate(),
        'month': currentDate.getMonth() + 1,
        'year': currentDate.getFullYear()
    };

    const [SystemTheme, setSystemTheme] = useState<any>(null);
    const [JadwalDaily, setJadwalDaily] = useState<any>(null);
    const [UserLocation, setUserLocation] = useState<any>(null);
    const [CityId, setCityId] = useState<any>(null);
    const [City, setCity] = useState<any>(null);

    const getUserLocations = async (latitude: number, longitude: number) => {
        const data = await SholatServices.getUserLocations(latitude, longitude);
        setUserLocation(data.data.locationData.city);
    }

    const getCityId = async (city: string) => {
        const CityData = await SholatServices.getCityId(city);
        const GetCityData = CityData.data.data[0];
        setCity(GetCityData.lokasi);
        setCityId(GetCityData.id);
    }

    const getScheduleSholatDaily = async (cityId: number, year: number, month: number, date: number) => {
        const ScheduleSholat = await SholatServices.getScheduleSholatDaily(cityId, year, month, date);
        const GetDataDailyScheduleSholat = ScheduleSholat.data.data.data;
        setJadwalDaily(GetDataDailyScheduleSholat.jadwal);
    }

    useEffect(() => {
        const getLocation = () => {
            const options = { enableHighAccuracy: true };
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getUserLocations(latitude, longitude);
                },
                (error) => console.error(error.message),
                options
            );
        };
        getLocation();
    }, []);

    useEffect(() => {
        if (UserLocation) {
            getCityId(UserLocation.name);
        }

        if (CityId) {
            getScheduleSholatDaily(CityId, GetDate.year, GetDate.month, GetDate.day);
        }

        const currentTheme = theme === 'system' ? systemTheme : theme;
        setSystemTheme(currentTheme);

    }, [CityId, GetDate.year, GetDate.month, GetDate.day, UserLocation, theme, systemTheme]);

    const ScheduleSholat = SystemTheme === "dark" ? "bg-gray-500" : "bg-gray-100";
    const BorderScheduleSholat = SystemTheme === "dark" ? "border-gray-500" : "border-gray-200";


    return (
        <div>
            <BackNavigations SurahName='' link={'/Home'} />
            <DateSlider />
            <div className={`${ScheduleSholat} mt-10`}>
                <div className="flex flex-wrap gap-2 p-3 border-b border-gray-700">
                    <i className='bx bx-current-location text-3xl font-bold'></i>
                    <h5 className="text-left text-2xl font-semibold">
                        {City}
                    </h5>
                </div>


                <div className="block p-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`text-center text-xl border ${BorderScheduleSholat} border-r-gray-700`}>
                            Waktu Imsak
                            <h5 className="text-3xl font-bold mt-3 mb-3">
                                {JadwalDaily && JadwalDaily.imsak}
                            </h5>
                        </div>
                        <div className=" text-center text-xl ">
                            Waktu Berbuka
                            <h5 className="text-3xl font-bold mt-3 mb-3">
                                {JadwalDaily && JadwalDaily.maghrib}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${ScheduleSholat} mt-10`}>
                <div className="grid grid-cols-1 gap-5 ml-2 mr-2 mt-10 pb-16">
                    <ScheduleCard title="Sholat Subuh" Jadwal={JadwalDaily && JadwalDaily.subuh} />
                    <ScheduleCard title="Sholat Dhuha" Jadwal={JadwalDaily && JadwalDaily.dhuha} />
                    <ScheduleCard title="Sholat Dzuhur" Jadwal={JadwalDaily && JadwalDaily.dhuha} />
                    <ScheduleCard title="Sholat Ashar" Jadwal={JadwalDaily && JadwalDaily.ashar} />
                    <ScheduleCard title="Sholat Maghrib" Jadwal={JadwalDaily && JadwalDaily.maghrib} />
                    <ScheduleCard title="Sholat Isya" Jadwal={JadwalDaily && JadwalDaily.isya} />
                </div>
            </div>
            <MobileNavigations />
        </div>
    );
}

export default UserLocations;
