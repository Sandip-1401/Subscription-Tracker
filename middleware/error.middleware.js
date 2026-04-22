const errorMiddlerware = (err, req, res, next) => {
   try {

      let error = { ...err }
      error.message = err.message;

      console.log("ERROR:", error);

      if (error.name === 'CastError') {
         error.message = `Resource not found with id of ${error.value}`;
         error = new Error(error.message);
         error.statusCode = 404;
      }

      if (error.code === 11000) {
         const message = `Duplicate field value entered: ${JSON.stringify(error.keyValue)}`;
         error = new Error(message);
         error.statusCode = 400;
      }

      if (error.name === 'ValidationError') {
         const message = Object.values(error.errors).map(val => val.message).join(', ');
         error = new Error(message.join(', '));
         error.statusCode = 400;
      }

      res.status(error.statusCode || 500).json({
         success: false,
         error: error.message || 'Server Error'
      })

   } catch (error) {
      next(error);
   }
}

export default errorMiddlerware;