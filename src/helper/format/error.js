import formatDefaultError from './error/default';
import formatValidatorError from './error/validator';

export default function formatError(format, type) {
  const defaultError = formatDefaultError(format, type);
  const validatorError = formatValidatorError(format);

  return (datum, index, nodes, { error, route }) => {
    if (typeof error.field !== 'undefined') {
      return validatorError(datum, index, nodes, { error, route });
    }

    return defaultError(datum, index, nodes, { error, route });
  };
}
