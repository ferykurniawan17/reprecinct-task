import React, { useState } from "react";
import { Button } from "@/modules/shared/components/ui/button";
import useMutationCreateAttributes from "@/modules/attribute/hooks/useMutationCreateAttributes";
import { TextArea } from "@radix-ui/themes";
import { validateAndSanitize } from "@/lib/validation";
import useAttributesPage from "@/modules/attribute/hooks/useAttributesPage";

const AttributesForm: React.FC = () => {
  const [attributesInput, setAttributesInput] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const createAttributesMutation = useMutationCreateAttributes();

  // Get existing attributes to check for duplicates
  const { data: existingData } = useAttributesPage({
    tableQueries: { limit: 1000 }, // Get all existing attributes for validation
  });

  const existingAttributeNames =
    existingData?.data?.map((attr) => attr.name.toLowerCase()) || [];

  const validateAttributes = (input: string) => {
    const errors: string[] = [];
    const attributes = input
      .split(/[,;\n]/)
      .map((attr) => attr.trim())
      .filter((attr) => attr !== "");

    if (attributes.length === 0) {
      return { valid: false, errors: [], validAttributes: [] };
    }

    const validAttributes: string[] = [];
    const seenAttributes = new Set<string>();

    for (const attr of attributes) {
      const { isValid, sanitized, error } = validateAndSanitize(attr);

      if (!isValid) {
        errors.push(`"${attr}" → ${error}`);
        continue;
      }

      const lowerCaseSanitized = sanitized.toLowerCase();

      // Check for duplicates in current input
      if (seenAttributes.has(lowerCaseSanitized)) {
        errors.push(`"${sanitized}" is duplicated in your input.`);
        continue;
      }

      // Check if attribute already exists in database
      if (existingAttributeNames.includes(lowerCaseSanitized)) {
        errors.push(`"${sanitized}" already exists.`);
        continue;
      }

      seenAttributes.add(lowerCaseSanitized);
      validAttributes.push(sanitized);
    }

    return {
      valid: validAttributes.length > 0,
      errors,
      validAttributes,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAttributes(attributesInput);
    setValidationErrors(validation.errors);

    if (!validation.valid) {
      return;
    }

    createAttributesMutation.mutate(
      { attributes: validation.validAttributes },
      {
        onSuccess: () => {
          // Reset form
          setAttributesInput("");
          setValidationErrors([]);
        },
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAttributesInput(e.target.value);
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Real-time validation preview
  const currentValidation = attributesInput.trim()
    ? validateAttributes(attributesInput)
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Create New Attributes</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="attributes"
            className="text-sm font-medium text-gray-700"
          >
            Attributes
          </label>
          <TextArea
            id="attributes"
            placeholder="Enter attribute names separated by commas, semicolons, or new lines&#10;Example: Color, Size, Weight"
            value={attributesInput}
            onChange={handleInputChange}
            size="3"
            variant="surface"
            resize="vertical"
            style={{ minHeight: "100px" }}
          />
          <p className="text-xs text-gray-500">
            Separate multiple attributes with commas (,), semicolons (;), or new
            lines. Only letters, numbers, regular spaces, and single quotes are
            allowed. Special characters, double quotes, tabs, emojis, and
            control characters are not permitted.
          </p>

          {/* Real-time validation preview */}
          {currentValidation &&
            attributesInput.trim() &&
            !validationErrors.length && (
              <div className="text-xs">
                {currentValidation.validAttributes.length > 0 && (
                  <p className="text-green-600">
                    ✓ {currentValidation.validAttributes.length} valid
                    attribute(s) ready to create
                  </p>
                )}
                {currentValidation.errors.length > 0 && (
                  <div className="space-y-1">
                    {currentValidation.errors.map((error, index) => (
                      <p key={index} className="text-orange-600">
                        ⚠ {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Validation Errors on Submit */}
          {validationErrors.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-600">
                Please fix the following issues:
              </p>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">
                  • {error}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            disabled={
              createAttributesMutation.isPending ||
              attributesInput.trim() === "" ||
              validationErrors.length > 0
            }
          >
            {createAttributesMutation.isPending
              ? "Creating..."
              : "Create Attributes"}
          </Button>

          {createAttributesMutation.isError && (
            <span className="text-sm text-red-600">
              Error creating attributes. Please try again.
            </span>
          )}

          {createAttributesMutation.isSuccess && (
            <span className="text-sm text-green-600">
              Attributes created successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AttributesForm;
