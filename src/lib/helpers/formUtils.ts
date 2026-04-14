export const mapLookupsToOptions = <T extends Record<string, any>>(
  lookups: Record<string, T[]> | null | undefined,
  lookupKey: string,
  extraLabelKeys: string[] = []
): { value: any; label: string }[] => {
  if (!lookups || !lookups[lookupKey]) return [];

  return lookups[lookupKey].map((item) => {
    const singularKey = lookupKey.replace(/s$/, '');
    
    // Comprehensive list of potential label keys based on API analysis
    const potentialLabelKeys = [
      'name', 
      'label', 
      'title', 
      'text', 
      lookupKey, 
      singularKey,
      'groupName',
      'currencyName',
      'documentType',
      'rating',
      'type',
      'status',
      'education',
      'visa',
      'asset',
      'condition',
      'exitType',
      'exitStatus',
      'rountRule', // API typo: "rountRule"
      'department',
      ...extraLabelKeys
    ];
    
    let label = '';

    // Special handling for Employee/Manager names if firstName or lastName exists
    if (item.firstName !== undefined || item.lastName !== undefined) {
      label = `${item.firstName || ''} ${item.lastName || ''}`.trim();
    }

    if (!label) {
      for (const k of potentialLabelKeys) {
        if (item[k] !== undefined && item[k] !== null && typeof item[k] === 'string') {
          label = item[k];
          break;
        }
      }
    }

    // Fallback if no specific string property is found
    if (!label) {
      const stringValue = Object.values(item).find(v => typeof v === 'string');
      label = stringValue ? String(stringValue) : String(item.id || '');
    }

    // Extract unique ID/Value, check for common ID fields
    let value = '';
    if (item.id !== undefined && item.id !== null) {
      value = String(item.id);
    } else if (item.value !== undefined && item.value !== null) {
      value = String(item.value);
    } else if (item.c_id !== undefined && item.c_id !== null) {
      value = String(item.c_id);
    } else if (item.type_id !== undefined && item.type_id !== null) {
      value = String(item.type_id);
    } else {
      // Fallback: if it's a primitive, use it; if object, try to find ANY number or string id prop
      if (typeof item !== 'object') {
        value = String(item);
      } else {
        const idProp = Object.keys(item).find(k => k.toLowerCase().includes('id') && (typeof item[k] === 'number' || typeof item[k] === 'string'));
        value = idProp ? String(item[idProp]) : String(item);
      }
    }

    return {
      value: value,
      label: label,
    };
  });
};
