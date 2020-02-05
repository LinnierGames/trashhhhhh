import mongoose from "mongoose";

export default () => {
  mongoose.Promise = global.Promise;
  
  const URI = process.env.MONGODB_URI;
  if (typeof URI !== 'undefined') {
    mongoose.connect(URI, { useNewUrlParser: true }, error => {
      if (error) { console.log(`Error connecting: ${error.message}`) }
      else { console.log('connected to mongoose') }
    });
  }
  
  mongoose.set('debug', true);
  mongoose.set('useCreateIndex', true);
}
