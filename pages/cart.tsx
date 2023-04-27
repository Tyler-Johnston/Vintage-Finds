import { Shipment } from '../dto/shipment';

export default function Cart() {
    // eslint-disable-next-line global-require
    const shippo = require('shippo')(process.env.NEXT_PUBLIC_REACT_APP_SHIPPO_API_TOKEN);

    const addressFrom = {
        name: 'Mr Hippo',
        company: 'SF Zoo',
        street1: '2945 Sloat Blvd',
        city: 'San Francisco',
        state: 'CA',
        zip: '94132',
        country: 'US',
        phone: '+1 555 341 9393',
        email: 'mrhippo@goshippo.com',
    };

    const addressTo = {
        name: 'Ms Hippo',
        company: 'Shippo',
        street1: '215 Clayton St.',
        city: 'San Francisco',
        state: 'CA',
        zip: '94117',
        country: 'US',
        phone: '+1 555 341 9393',
        email: 'support@goshippo.com',
    };

    const parcel = {
        length: '5',
        width: '5',
        height: '5',
        distance_unit: 'in',
        weight: '2',
        mass_unit: 'lb',
    };

    const shipment = {
        address_from: addressFrom,
        address_to: addressTo,
        parcels: [parcel],
    };

    shippo.shipment.create(shipment, (err: string, shipmentData: Shipment) => {
        if (err) {
            console.log(err);
        } else {
            console.log('shipment : %s', JSON.stringify(shipmentData, null, 2));
            console.log('rates : %s', JSON.stringify(shipmentData.rates, null, 2));
        }
    });

    return (
        <>
            <p>welcome to the cart page</p>
        </>
    );
}
