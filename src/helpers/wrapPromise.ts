enum PromiseStatus {
  PENDING, ERROR, SUCCESS
}

export const wrapPromise = <T>(promise: Promise<T>) => {
  let status: PromiseStatus = PromiseStatus.PENDING;
  let result: any;
  let suspender = promise.then(
    (r) => {
      status = PromiseStatus.SUCCESS;
      result = r;
    },
    (e) => {
      status = PromiseStatus.ERROR;
      result = e;
    }
  );
  return {
    read(): T {
      switch (status) {
        case PromiseStatus.PENDING:
          throw suspender;
        case PromiseStatus.ERROR:
          throw result;
        case PromiseStatus.SUCCESS:
          return result;
      }
    },
  };
};