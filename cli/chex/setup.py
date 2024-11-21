from setuptools import setup

setup(
    name="chex",
    version="1.0.0",
    install_requires=[
        "click>=8.1.7",
        "prettytable>=3.10.0",
        "setuptools>=49.2.1",
        "lxml>=5.1.0"
    ],
    entry_points="""
        [console_scripts]
        chex=chex:cli
    """,
)
