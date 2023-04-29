import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { ref, get, child } from 'firebase/database';
import { db } from '../../../lib/firebase';
import { Antique } from '../../../dto/antique';
import { Shipment } from '../../../dto/shipment';
import { Address } from '../../../dto/address';
import { Location } from '../../../dto/Location';
import { ErrorTitle } from '../../../components/Error/Error';

export default function AntiqueTest() {
    const router = useRouter();
    const [antique, setAntique] = useState<Antique>();
    const [shipmentData, setShipmentData] = useState<Shipment | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [location, setLocation] = useState<Location | null>(null);

    // eslint-disable-next-line global-require
   const shippo = require('shippo')(process.env.NEXT_PUBLIC_REACT_APP_SHIPPO_API_TOKEN);

    const CHEAPEST = 0;
    const BESTVALUE = 1;

    async function getAntiqueId() {
        const { id } = await router.query;
        const parameters = id as string;
        const index = parameters.lastIndexOf('/');
        return parameters.substring(index + 1);
    }

    async function getAntiqueData() {
        const dbRef = ref(db);
        const id = await getAntiqueId();
        try {
          const snapshot = await get(child(dbRef, `antiques/${id}`));
          if (snapshot.exists()) {
            const data = snapshot.val() as Antique;
            setAntique(data);
          } else {
            console.log('No data available');
          }
        } catch (error) {
          console.error(error);
        }
      }

    useEffect(() => {
        getAntiqueData();
        if (typeof window !== 'undefined') {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setLocation({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        }
      }, []);

    async function getReverseGeocode() {
        if (location) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                const addressData = await data.address;
                setAddress(addressData);
            } catch (error) {
                console.error(error);
            }
        }
    }

    function getShipmentInfo() {
        if (address) {
            const addressTo = {
                street1: address.road,
                city: address.city,
                state: address.state,
                zip: address.postcode,
                country: address.country,
            };
            const addressFrom = {
                street1: '1045 N 2000 W',
                city: 'Springville',
                state: 'UT',
                zip: '84663',
                country: 'US',
              };
            const parcel = {
                length: antique?.length,
                width: antique?.width,
                height: antique?.height,
                distance_unit: 'in',
                weight: antique?.weight,
                mass_unit: 'lb',
            };
            const shipment = {
                address_from: addressFrom,
                address_to: addressTo,
                parcels: [parcel],
            };
            shippo.shipment.create(shipment, (err: string, shipmentInfo: Shipment) => {
                if (err) {
                    console.log(err);
                } else {
                    setShipmentData(shipmentInfo);
                }
            });
        }
    }

    useEffect(() => {
        getReverseGeocode();
    }, [location]);

    useEffect(() => {
        getShipmentInfo();
    }, [address]);

    return (
        <>
            {antique ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <p>{antique.name}</p>
                        <Image src={antique.url} alt="antique" width={400} height={400} />
                        <p>{antique.description}</p>
                        <p>${antique.price}</p>
                        <p>cheapest cost: ${shipmentData ? shipmentData.rates[CHEAPEST].amount : 'X'} and will take {shipmentData ? shipmentData.rates[CHEAPEST].estimated_days : 'unknown'} days to arrive</p>
                        <p>best value cost: ${shipmentData ? shipmentData.rates[BESTVALUE].amount : 'X'} and will take {shipmentData ? shipmentData.rates[BESTVALUE].estimated_days : 'unknown'} days to arrive</p>
                    </div>
                </div>
            )
            : (
                <div>
                    <ErrorTitle
                      number={404}
                      description="You may have mistyped the address, or the page has been moved to another URL."
                    />
                </div>
            )}
        </>
    );
}
