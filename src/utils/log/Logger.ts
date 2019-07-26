interface Logger {
  trace(body: string, extra?: any);

  debug(body: string, extra?: any);

  info(body: string, extra?: any);

  warn(body: string, extra?: any);

  error(body: string, extra?: any);

  fatal(body: string, extra?: any);
}

export { Logger };
