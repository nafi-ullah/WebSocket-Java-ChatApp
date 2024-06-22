/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'jobsnavi.obs.eu-de.otc.t-systems.com',
          port: '',
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "i.ibb.co",
          port: "",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "i.pravatar.cc",
          port: "",
          pathname: "/**",
        },
      ],
    },
};

export default nextConfig;
