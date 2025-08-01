import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShortUrl } from "../api/shortUrl.api.js";

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState();
  const [customUrl, setCustomUrl] = useState();
  const [copied, setCopied] = useState(false);

  // const queryClient = useQueryClient()

  const updateValue = (e) => {
    const { name, value } = e.target;
    if (name === "url") setUrl(value);
    else if (name === "customurl") setCustomUrl(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createShortUrl(url, customUrl);
      setShortUrl(data); // success
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Custom URL already exists."); // show "Custom URL already exists."
      } else {
        alert("Custom URL already exists.");
      }
    }
  };

  // const query = useQuery({ queryKey: [] , queryFn: handleSubmit })

  // const mutation = useMutation({
  //   mutationFn: handleSubmit,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: [] })
  //   },
  // })

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-6 sm:mt-10 space-y-4"
      >
        <label
          htmlFor="urlInput"
          className="text-lg font-semibold text-blue-700"
        >
          Enter a URL to shorten:
        </label>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/4">
            <input
              id="customurlInput"
              name="customurl"
              value={customUrl}
              onChange={updateValue}
              type="text"
              placeholder="Custom URL (optional)"
              className="bg-white border-2 border-blue-500 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-3/4">
            <input
              id="urlInput"
              name="url"
              value={url}
              onChange={updateValue}
              type="text"
              placeholder="https://example.com"
              className="bg-white border-2 border-blue-500 w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 w-full sm:w-auto sm:max-w-xs text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Short URL
        </button>
      </form>

      {shortUrl && (
        <div className="mt-8 sm:mt-10">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            Your Shortened URL:{" "}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 border-2 border-blue-500 rounded-md overflow-hidden">
              <input
                value={shortUrl}
                readOnly
                type="text"
                className="bg-white p-2 w-full focus:outline-none"
              />
            </div>
            <button
              onClick={handleCopy}
              className={`px-6 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                copied
                  ? "bg-green-400 text-white focus:ring-green-500"
                  : "bg-gray-200 hover:bg-gray-300 focus:ring-gray-500"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
