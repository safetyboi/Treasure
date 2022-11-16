export const PinBox = ({pin})=> {
    return (
        <>
        <div>{`${pin.order}: ${pin.location.latitude},${pin.location.longitude}`}</div>
        {/* <div>{`${pin.location.latitude},${pin.location.longitude}`}</div>  */}
        {/* note: we want to be able to click on this pinbox and trigger a re-render of the pin editor */}
        </>
    )

}

//NOTE: 'pin.location.lattitude' & 'pin.location.longitude' are not coming from the database--just the useState of 'pins' in EventCreate, which in turn should be getting that info automatically from Moses' Map Component 


// const pinSchema = Schema({
//     event: {
//       type: Schema.Types.ObjectId,
//       ref: 'Event'
//     },
//     location: [{
//       xCoord: {
//           type: Number,
//           required: true
//       },
//       yCoord: {
//           type: Number,
//           required: true
//       },
//     }],
//     order: {
//       type: Number,
//       required: true
//     },
//     clue: [{
//       text: {
//           type: String,
//           required: true
//       },
//       image: {
//           type: String,
//           required: true
//       },
//     }],
//     answer: [{
//       text: {
//           type: String
//       },
//       image: {
//           type: String
//       },
//     }],
//     nextAnswer: [{
//       text: {
//           type: String
//       },
//       image: {
//           type: String
//       },
//     }],
//     price: {
//       type: Number,
//       require: true
//     },
//     supplies: {
//       type: String
//     }
//   }, {
//     timestamps: true
//   });